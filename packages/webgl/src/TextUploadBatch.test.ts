import type { Node } from "@next2d/texture-packer";
import { afterEach, expect, it, vi } from "vitest";

const fixture = async () =>
{
    vi.resetModules();
    const uploads: Map<string, number>[] = [];
    const draws: { target: number; uniform: number[]; value: number | undefined }[] = [];
    const deleted: object[] = [];
    const clears: number[][] = [];
    let active = 0;
    let fail = false;
    let noContext = false;
    let reentrantFlush: (() => void) | null = null;
    let bound: { resource: object; pixels: Map<string, number>; width: number; height: number };
    const canvases: Canvas[] = [];
    class Canvas
    {
        pixels = new Map<string, number>();
        private _width: number;
        constructor (width: number, public height: number) { this._width = width; canvases.push(this); }
        get width (): number { return this._width; }
        set width (value: number) { this._width = value; this.pixels.clear(); }
        getContext (): object | null
        {
            return noContext ? null : {
                clearRect: (x: number, y: number, width: number, height: number) => {
                    for (const key of this.pixels.keys()) {
                        const [px, py] = key.split(":").map(Number);
                        if (px >= x && px < x + width && py >= y && py < y + height) {
                            this.pixels.delete(key);
                        }
                    }
                },
                drawImage: (source: { value: number }, x: number, y: number) => {
                    this.pixels.set(`${x}:${y}`, source.value);
                }
            };
        }
    }
    vi.stubGlobal("OffscreenCanvas", Canvas);
    const main = { id: 0, width: 800, height: 600, mask: true };
    const atlases = [1, 2].map(id => ({ id, width: 4096, height: 4096, mask: false }));
    let native = main;
    const bindings: (typeof bound | null)[] = [null, null, null];
    const context = {
        $matrix: new Float32Array(9), newDrawState: false,
        globalAlpha: 0.2, globalCompositeOperation: "add", imageSmoothingEnabled: true
    };
    const shader = { highp: new Float32Array(12) };
    const getTexture = vi.fn((width: number, height: number) => ({ resource: {}, pixels: new Map<string, number>(), width, height }));
    vi.doMock("./WebGLUtil", () => ({
        $context: context, $RENDER_MAX_SIZE: 4096,
        $gl: {
            TEXTURE_2D: 1, RGBA: 2, UNSIGNED_BYTE: 3,
            texSubImage2D: (_target: number, _level: number, _x: number, _y: number,
                _format: number, _type: number, canvas: Canvas) => {
                bound.pixels = new Map(canvas.pixels);
                uploads.push(new Map(bound.pixels));
            },
            deleteTexture: (resource: object) => deleted.push(resource)
        }
    }));
    vi.doMock("./FrameBufferManager", () => ({ get $currentAttachment () { return native; } }));
    vi.doMock("./AtlasManager", () => ({
        $getAtlasAttachmentObject: () => atlases[active], $setAtlasPageDirty: vi.fn()
    }));
    vi.doMock("./TextureManager", () => ({ $boundTextures: bindings }));
    vi.doMock("./Context/usecase/ContextBindUseCase", () => ({
        execute: (_context: object, attachment: typeof main) => { native = attachment; reentrantFlush?.(); }
    }));
    vi.doMock("./Context/service/ContextBeginNodeRenderingService", () => ({
        execute: (x: number, y: number, width: number, height: number) => {
            clears.push([native.id, x, y, width, height]);
        }
    }));
    vi.doMock("./Context/service/ContextEndNodeRenderingService", () => ({ execute: vi.fn() }));
    vi.doMock("./Context/service/ContextUpdateTransferBoundsService", () => ({ execute: vi.fn() }));
    vi.doMock("./TextureManager/usecase/TextureManagerGetTextureUseCase", () => ({ execute: getTexture }));
    vi.doMock("./TextureManager/usecase/TextureManagerBind0UseCase", () => ({
        execute: (texture: typeof bound) => { bound = texture; bindings[0] = texture; }
    }));
    vi.doMock("./Shader/Variants/Blend/service/VariantsBlendTextBatchShaderService", () => ({ execute: () => shader }));
    vi.doMock("./Blend/service/BlendResetService", () => ({ execute: vi.fn() }));
    vi.doMock("./Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
        execute: () => {
            if (fail) { throw new Error("draw failed"); }
            const u = Array.from(shader.highp);
            draws.push({ target: native.id, uniform: u,
                value: bound.pixels.get(`${u[8] * bound.width}:${bound.height - u[9] * bound.height - u[3]}`) });
        }
    }));
    const api = await import("./TextUploadBatch");
    const node = (i: number, width = 100, height = 20): Node => ({
        index: active, x: i * 110, y: active * 30, w: width, h: height
    } as Node);
    const source = (value: number, width = 100, height = 20): OffscreenCanvas & { value: number } =>
        ({ value, width, height } as OffscreenCanvas & { value: number });
    return { api, node, source, canvases, uploads, draws, deleted, clears, bindings, context, main, getTexture,
        get native () { return native; },
        setActive: (value: number) => { active = value; },
        setFail: (value: boolean) => { fail = value; },
        setReentrantFlush: (callback: () => void) => { reentrantFlush = callback; },
        setNoContext: () => { noContext = true; }
    };
};

afterEach(() => { vi.unstubAllGlobals(); });

it("copies scratch pixels before reuse and preserves the current attachment and CPU transform", async () => {
    const x = await fixture(), source = x.source(0);
    for (let i = 0; i < 20; ++i) {
        source.value = i;
        expect(x.api.queueTextUpload(x.node(i), source)).toBe(true);
        expect(x.native).toBe(x.main);
    }
    source.value = -1;
    expect(x.uploads).toHaveLength(0);
    const matrix = Array.from(x.context.$matrix);
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual(Array.from({ length: 20 }, (_, i) => i));
    expect(x.uploads).toHaveLength(1);
    expect(x.getTexture).toHaveBeenCalledExactlyOnceWith(512, 512, false, false);
    expect(Array.from(x.context.$matrix)).toEqual(matrix);
    expect(x.context).toMatchObject({ globalAlpha: 1, globalCompositeOperation: "normal", imageSmoothingEnabled: false });
    expect(x.native).toBe(x.main);
});

it("keeps copied node coordinates, atlas pages and draw order", async () => {
    const x = await fixture();
    for (let i = 0; i < 12; ++i) {
        x.setActive(i % 2);
        const node = x.node(i);
        x.api.queueTextUpload(node, x.source(i));
        node.x = node.y = -999;
    }
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.target)).toEqual(Array.from({ length: 12 }, (_, i) => 1 + i % 2));
    expect(x.clears).toEqual(Array.from({ length: 12 }, (_, i) => [1 + i % 2, i * 110, i % 2 * 30, 100, 20]));
    expect(x.draws.map(d => d.uniform.slice(0, 6))).toEqual(
        Array.from({ length: 12 }, (_, i) => [i * 110, 4096 - i % 2 * 30 - 20, 100, 20, 4096, 4096])
    );
});

it("drains reused or released regions, including an aliased node, without flushing unrelated old caches", async () => {
    const x = await fixture(), node = x.node(0);
    x.api.queueTextUpload(node, x.source(1));
    x.api.flushTextUploadsForNode(x.node(1));
    expect(x.uploads).toHaveLength(0);
    x.api.flushTextUploadsForNode({ ...node } as Node);
    expect(x.draws.map(d => d.value)).toEqual([1]);
    x.api.queueTextUpload(node, x.source(2));
    x.api.queueTextUpload(node, x.source(3));
    expect(x.draws.map(d => d.value)).toEqual([1, 2]);
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual([1, 2, 3]);
});

it.each([[25, 300, 25], [1025, 1, 2]])("bounds %i pending images of width %i", async (count, size, uploads) => {
    const x = await fixture();
    for (let i = 0; i < count; ++i) { x.api.queueTextUpload(x.node(i, size, size), x.source(i, size, size)); }
    x.api.flushTextUploads();
    expect(x.uploads).toHaveLength(uploads);
    expect(x.draws.map(d => d.value)).toEqual(Array.from({ length: count }, (_, i) => i));
});

it.each([[0, 20, 0, 20], [1025, 20, 1025, 20], [20, 1025, 20, 1025], [100, 20, 99, 20]])(
    "falls back for invalid or mismatched dimensions %i,%i,%i,%i", async (w, h, sw, sh) => {
        const x = await fixture();
        expect(x.api.queueTextUpload(x.node(0, w, h), x.source(1, sw, sh))).toBe(false);
        x.api.flushTextUploads();
        expect(x.getTexture).not.toHaveBeenCalled();
    }
);

it("falls back when the staging canvas has no 2D context", async () => {
    const x = await fixture();
    x.setNoContext();
    expect(x.api.queueTextUpload(x.node(0), x.source(1))).toBe(false);
    expect(x.getTexture).not.toHaveBeenCalled();
});

it("disposes owned GPU storage and pending references even after a draw throws", async () => {
    const x = await fixture();
    x.api.queueTextUpload(x.node(0), x.source(1));
    x.setFail(true);
    expect(() => x.api.disposeTextUploads()).toThrow("draw failed");
    expect(x.native).toBe(x.main);
    expect(x.deleted).toHaveLength(1);
    expect(x.bindings).toEqual([null, null, null]);
    x.api.disposeTextUploads();
    expect(x.deleted).toHaveLength(1);
    x.setFail(false);
    x.api.queueTextUpload(x.node(1), x.source(2));
    x.api.flushTextUploads();
    expect(x.getTexture).toHaveBeenCalledTimes(2);
    expect(x.draws.map(d => d.value)).toEqual([2]);
});

it("leaves the private staging canvas transparent after successful and failed draws", async () => {
    const x = await fixture();
    x.api.queueTextUpload(x.node(0), x.source(1));
    expect(x.canvases[0].pixels.size).toBe(1);
    x.api.flushTextUploads();
    expect(x.canvases[0].pixels.size).toBe(0);
    x.api.queueTextUpload(x.node(1), x.source(2));
    x.setFail(true);
    expect(() => x.api.flushTextUploads()).toThrow("draw failed");
    expect(x.canvases[0].pixels.size).toBe(0);
    x.setFail(false);
    x.api.queueTextUpload(x.node(2), x.source(3));
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual([1, 3]);
    expect(x.canvases).toHaveLength(1);
});


it("flushes small storage with its original UVs and pages before growing", async () => {
    const x = await fixture();
    x.api.queueTextUpload(x.node(0), x.source(1));
    x.setActive(1);
    x.api.queueTextUpload(x.node(1), x.source(2));
    expect(x.api.queueTextUpload(x.node(2, 513, 24), x.source(3, 513, 24))).toBe(true);
    expect(x.draws.map(d => [d.target, d.value])).toEqual([[1, 1], [2, 2]]);
    expect(x.draws[1].uniform[8]).toBe(100 / 512);
    expect(x.deleted).toHaveLength(1);
    expect(x.bindings).toEqual([null, null, null]);
    expect(x.native).toBe(x.main);
    x.api.queueTextUpload(x.node(3), x.source(4));
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual([1, 2, 3, 4]);
    expect(x.draws[3].uniform[8]).toBe(513 / 1024);
    expect(x.getTexture.mock.calls.map(c => c.slice(0, 2))).toEqual([[512, 512], [1024, 1024]]);
    expect(x.canvases.map(c => c.width)).toEqual([512, 1024]);
});

it.each([[512, 24, 512], [24, 512, 512], [513, 24, 1024], [24, 513, 1024], [1024, 1024, 1024]])(
    "accepts %i by %i in staging %i without pending work", async (width, height, size) => {
        const x = await fixture();
        expect(x.api.queueTextUpload(x.node(0, width, height), x.source(1, width, height))).toBe(true);
        x.api.flushTextUploads();
        expect(x.draws.map(d => d.value)).toEqual([1]);
        expect(x.canvases.map(c => c.width)).toEqual([size]);
        expect(x.getTexture).toHaveBeenCalledExactlyOnceWith(size, size, false, false);
    }
);

it("keeps grown storage across flushes and starts small again after disposal", async () => {
    const x = await fixture();
    x.api.queueTextUpload(x.node(0, 513, 24), x.source(1, 513, 24));
    x.api.flushTextUploads();
    x.api.queueTextUpload(x.node(1), x.source(2));
    x.api.flushTextUploads();
    expect(x.canvases.map(c => c.width)).toEqual([1024]);
    expect(x.getTexture).toHaveBeenCalledOnce();
    x.api.disposeTextUploads();
    x.api.queueTextUpload(x.node(2), x.source(3));
    x.api.flushTextUploads();
    expect(x.canvases.map(c => c.width)).toEqual([1024, 512]);
    expect(x.draws.map(d => d.value)).toEqual([1, 2, 3]);
});

it("does not grow or disturb pending pixels for oversized or mismatched sources", async () => {
    const x = await fixture();
    x.api.queueTextUpload(x.node(0), x.source(1));
    for (const [width, height, sw, sh] of [[1025, 24, 1025, 24], [24, 1025, 24, 1025], [513, 24, 512, 24]]) {
        expect(x.api.queueTextUpload(x.node(1, width, height), x.source(2, sw, sh))).toBe(false);
    }
    expect(x.canvases.map(c => c.width)).toEqual([512]);
    expect(x.uploads).toHaveLength(0);
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual([1]);
});

it("drops old pending storage and clears binding aliases when growth flushing fails", async () => {
    const x = await fixture();
    x.api.queueTextUpload(x.node(0), x.source(1));
    x.api.flushTextUploads();
    x.bindings[1] = x.bindings[2] = x.bindings[0];
    x.api.queueTextUpload(x.node(1), x.source(2));
    x.setFail(true);
    expect(() => x.api.queueTextUpload(x.node(2, 513, 24), x.source(3, 513, 24))).toThrow("draw failed");
    expect(x.bindings).toEqual([null, null, null]);
    expect(x.deleted).toHaveLength(1);
    expect(x.native).toBe(x.main);
    x.setFail(false);
    x.api.queueTextUpload(x.node(3), x.source(4));
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual([1, 4]);
    expect(x.canvases.map(c => c.width)).toEqual([512, 512]);
});

it("handles the attachment bind reentrant flush while draining for growth", async () => {
    const x = await fixture();
    x.setReentrantFlush(x.api.flushTextUploads);
    x.api.queueTextUpload(x.node(0), x.source(1));
    x.api.queueTextUpload(x.node(1, 513, 24), x.source(2, 513, 24));
    x.api.flushTextUploads();
    expect(x.draws.map(d => d.value)).toEqual([1, 2]);
    expect(x.native).toBe(x.main);
});
