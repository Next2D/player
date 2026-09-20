import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExternalImageUploadBatch } from "./ExternalImageUploadBatch";

describe("ExternalImageUploadBatch", () => {
    const order: string[] = [];
    const drawImage = vi.fn();
    let contextAvailable = true;
    class Canvas {
        constructor(public width: number, public height: number) {}
        getContext() { return contextAvailable ? { drawImage } : null; }
    }
    const texture = { destroy: vi.fn() };
    const encoders: { copyTextureToTexture: ReturnType<typeof vi.fn>; finish: ReturnType<typeof vi.fn> }[] = [];
    const device = {
        createTexture: vi.fn(() => texture),
        createCommandEncoder: vi.fn(() => {
            order.push("encoder");
            const encoder = { copyTextureToTexture: vi.fn(() => { order.push("copy"); }), finish: vi.fn(() => { order.push("finish"); return {}; }) };
            encoders.push(encoder); return encoder;
        }),
        queue: {
            copyExternalImageToTexture: vi.fn(() => { order.push("upload"); }),
            submit: vi.fn(() => { order.push("submit"); })
        }
    };
    beforeEach(() => {
        vi.clearAllMocks(); order.length = encoders.length = 0; contextAvailable = true;
        vi.stubGlobal("OffscreenCanvas", Canvas);
    });
    const append = (batch: ExternalImageUploadBatch, width: number, height: number) =>
        batch.append(new Canvas(width, height) as unknown as OffscreenCanvas, {} as GPUTexture, width, height);

    it("snapshots immediately but records GPU copies only after the first external upload", () => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        expect(append(batch, 100, 20)).toBe(true);
        expect(append(batch, 40, 10)).toBe(true);
        expect(drawImage).toHaveBeenCalledTimes(2);
        expect(drawImage.mock.calls[1].slice(1)).toEqual([100, 0]);
        expect(device.createCommandEncoder).not.toHaveBeenCalled();
        expect(order).toEqual([]);
        batch.flush();
        expect(order).toEqual(["upload", "encoder", "copy", "copy", "finish", "submit"]);
        expect(device.queue.copyExternalImageToTexture.mock.calls[0][2]).toEqual({ width: 140, height: 20 });
        batch.flush();
        expect(device.queue.submit).toHaveBeenCalledTimes(1);
    });
    it("preserves each destination and packed region until flush despite source reuse", () => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        const first = {} as GPUTexture;
        const second = {} as GPUTexture;
        const source = new Canvas(600, 10);
        batch.append(source as unknown as OffscreenCanvas, first, 600, 10);
        source.height = 20;
        batch.append(source as unknown as OffscreenCanvas, second, 600, 20);
        source.width = source.height = 1;
        batch.flush();
        expect(encoders[0].copyTextureToTexture.mock.calls).toEqual([
            [{ texture, origin: [0, 0] }, { texture: first }, { width: 600, height: 10 }],
            [{ texture, origin: [0, 10] }, { texture: second }, { width: 600, height: 20 }]
        ]);
        append(batch, 12, 8);
        batch.flush();
        expect(encoders[1].copyTextureToTexture).toHaveBeenCalledTimes(1);
        expect(encoders[1].copyTextureToTexture.mock.calls[0][0]).toEqual({ texture, origin: [0, 0] });
    });
    it("wraps rows without uploading and includes the previous row in the copy extent", () => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        append(batch, 600, 10); append(batch, 600, 20);
        expect(drawImage.mock.calls[1].slice(1)).toEqual([0, 10]);
        batch.flush();
        expect(device.queue.copyExternalImageToTexture.mock.calls[0][2]).toEqual({ width: 600, height: 30 });
    });
    it("submits a full page before reusing the single staging GPU texture", () => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        append(batch, 600, 600); append(batch, 600, 600);
        expect(order).toEqual(["upload", "encoder", "copy", "finish", "submit"]);
        expect(encoders).toHaveLength(1);
        expect(drawImage.mock.calls[1].slice(1)).toEqual([0, 0]);
        expect(device.createTexture).toHaveBeenCalledTimes(1);
        batch.flush(); expect(device.queue.submit).toHaveBeenCalledTimes(2);
    });
    it.each([[1025, 1], [1, 1025], [0, 1], [1, 0]])("falls back for dimensions %s x %s", (width, height) => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        expect(append(batch, width, height)).toBe(false);
        expect(device.createTexture).not.toHaveBeenCalled();
    });
    it("falls back on size mismatch or a missing 2D context", () => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        expect(batch.append(new Canvas(8, 8) as unknown as OffscreenCanvas, {} as GPUTexture, 4, 4)).toBe(false);
        contextAvailable = false;
        expect(append(batch, 4, 4)).toBe(false);
        expect(device.createTexture).not.toHaveBeenCalled();
    });
    it("resize disposal drops unsubmitted copies and recreates bounded storage", () => {
        const batch = new ExternalImageUploadBatch(device as unknown as GPUDevice);
        append(batch, 8, 8); batch.dispose(); batch.flush();
        expect(order).toEqual([]);
        expect(texture.destroy).toHaveBeenCalledTimes(1);
        append(batch, 8, 8); batch.flush();
        expect(device.createTexture).toHaveBeenCalledTimes(2);
        expect(device.queue.submit).toHaveBeenCalledTimes(1);
        expect(encoders).toHaveLength(1);
        expect(encoders[0].copyTextureToTexture).toHaveBeenCalledTimes(1);
        expect(order).toEqual(["upload", "encoder", "copy", "finish", "submit"]);
    });
});
