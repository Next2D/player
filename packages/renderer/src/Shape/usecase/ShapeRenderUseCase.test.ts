import { execute } from "./ShapeRenderUseCase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $context } from "../../RendererUtil";
import { $cacheStore } from "@next2d/cache";

const mockNode = { "x": 0, "y": 0, "w": 100, "h": 100 };

vi.mock("@next2d/cache", () => ({
    "$cacheStore": {
        "get": vi.fn(() => mockNode),
        "set": vi.fn(),
        "has": vi.fn(() => false)
    }
}));

vi.mock("../../RendererUtil", () => ({
    "$context": {
        "reset": vi.fn(),
        "setTransform": vi.fn(),
        "useGrid": vi.fn(),
        "createNode": vi.fn(() => mockNode),
        "removeNode": vi.fn(),
        "beginNodeRendering": vi.fn(),
        "endNodeRendering": vi.fn(),
        "drawFill": vi.fn(),
        "drawPixels": vi.fn(),
        "drawDisplayObject": vi.fn(),
        "drawArraysInstanced": vi.fn(),
        "bind": vi.fn(),
        "applyFilter": vi.fn(),
        "currentAttachmentObject": null,
        "atlasAttachmentObject": null,
        "globalAlpha": 1,
        "imageSmoothingEnabled": true,
        "globalCompositeOperation": "normal"
    }
}));

vi.mock("../service/ShapeCommandService", () => ({
    "execute": vi.fn()
}));

vi.mock("../../DisplayObject/service/DisplayObjectGetBlendModeService", () => ({
    "execute": vi.fn(() => "normal")
}));

describe("ShapeRenderUseCase.js test", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("execute test case1 - render with cache hit", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.drawDisplayObject).mockClear();
        vi.mocked($context.setTransform).mockClear();

        // Build render queue for cached shape
        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 50, 60);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 100);
        // baseBounds xMin, yMin, xMax, yMax
        data.push(0, 0, 100, 100);
        // isGridEnabled, isDrawable, isBitmap
        data.push(0, 1, 0);
        // uniqueKey, cacheKey
        data.push(1, 0);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(1);
        // hasCache = 1 (cached)
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const resultIndex = execute(renderQueue, 0);

        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        expect(resultIndex).toBe(data.length);
    });

    it("execute test case2 - render with filter", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.applyFilter).mockClear();

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 50, 60);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 100);
        // baseBounds
        data.push(0, 0, 100, 100);
        // isGridEnabled, isDrawable, isBitmap
        data.push(0, 1, 0);
        // uniqueKey, cacheKey
        data.push(2, 0);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(2);
        // hasCache = 1
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 1
        data.push(1);
        // updated
        data.push(1);
        // filterBounds (4)
        data.push(-5, -5, 110, 110);
        // filter params length
        data.push(3);
        // filter params
        data.push(1, 2, 1);

        const renderQueue = new Float32Array(data);
        const resultIndex = execute(renderQueue, 0);

        expect($context.applyFilter).toHaveBeenCalledTimes(1);
        expect(resultIndex).toBe(data.length);
    });

    // Include an offset into an already sliced queue, as used by packed commands.
    const createQueue = (matrix: number[], mode = 0, filter = false): Float32Array =>
    {
        const data = [
            999, 998, 997,
            ...matrix,
            0.5, 0.75, 1, 0.5, 10, 20, 30, 64,
            -20.25, -10.5, 90.75, 80.25,
            -7, -11, 43, 49,
            0, 1, mode,
            12, 34, 2, 3, 56, 1,
            0, Number(filter),
            ...(filter ? [1, -25, -15, 100, 90, 3, 1, 2, 1] : [])
        ];
        const storage = new Float32Array(data.length + 8);
        storage.set(data, 5);
        return storage.subarray(5, 5 + data.length);
    };

    it.each([
        [1, 0, 0, 1, 50, 60],
        [2, 0, 0, 3, -15, 20],
        [0.6, 0.8, -2.4, 1.8, 50, 60],
        [-2, 0, 0, 3, 17, -21],
        [2, 0, 0, -3, 17, -21],
        [1, 0.5, 0.25, 2, -1.5, 0.125],
        [0, 0, 0, 0, 0, 0],
        [-0, -0, -0, -0, 50, 60]
    ])("preserves vector transform exactly for %j", (...matrix) =>
    {
        const queue = createQueue(matrix);
        const [a, b, c, d, e, f] = queue.subarray(3, 9);
        const radianX = Math.atan2(b, a);
        const radianY = Math.atan2(-c, d);
        const cosX = Math.cos(radianX);
        const sinX = Math.sin(radianX);
        const cosY = Math.cos(radianY);
        const sinY = Math.sin(radianY);
        const expected = radianX || radianY
            ? [cosX, sinX, -sinY, cosY,
                -14 * cosX + 33 * sinY + e,
                -14 * sinX - 33 * cosY + f]
            : [1, 0, 0, 1, -20.25, -10.5];
        const subarray = vi.spyOn(queue, "subarray");

        expect(execute(queue, 3)).toBe(queue.length);
        expect($context.setTransform).toHaveBeenCalledExactlyOnceWith(...expected);
        expect($context.drawDisplayObject).toHaveBeenCalledExactlyOnceWith(
            mockNode, -20.25, -10.5, 90.75, 80.25,
            queue, 9
        );
        expect($context.globalAlpha).toBe(0.5 + 64 / 255);
        expect($context.imageSmoothingEnabled).toBe(true);
        expect($cacheStore.get).toHaveBeenCalledWith("12", "34");
        expect(subarray).not.toHaveBeenCalled();
    });

    it("matches legacy vector transforms for 6000 seeded rotations, reflections and shears", () =>
    {
        let seed = 12345;
        const random = (): number =>
        {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 4294967296;
        };
        for (let sample = 0; sample < 6000; sample++) {
            const angleX = (random() - 0.5) * Math.PI * 2;
            const angleY = sample % 3 === 0 ? (random() - 0.5) * Math.PI * 2 : angleX;
            const scaleX = (random() - 0.5) * 20;
            const scaleY = sample % 3 === 1 ? scaleX : (random() - 0.5) * 20;
            const queue = createQueue([
                Math.cos(angleX) * scaleX, Math.sin(angleX) * scaleX,
                -Math.sin(angleY) * scaleY, Math.cos(angleY) * scaleY,
                (random() - 0.5) * 1000, (random() - 0.5) * 1000
            ]);
            const [a, b, c, d, e, f] = queue.subarray(3, 9);
            const x = Math.atan2(b, a);
            const y = Math.atan2(-c, d);
            const expected = x || y
                ? [Math.cos(x), Math.sin(x), -Math.sin(y), Math.cos(y),
                    -14 * Math.cos(x) + 33 * Math.sin(y) + e,
                    -14 * Math.sin(x) - 33 * Math.cos(y) + f]
                : [1, 0, 0, 1, -20.25, -10.5];
            vi.mocked($context.setTransform).mockClear();
            expect(execute(queue, 3)).toBe(queue.length);
            const actual = vi.mocked($context.setTransform).mock.calls[0];
            expect(actual.every((value, index) => Object.is(value, expected[index]))).toBe(true);
        }
    });

    it("preserves signed zeros, non-finite angles and degenerate matrix axes exactly", () =>
    {
        const values = [0, -0, 1, -1, Infinity, -Infinity, NaN];
        for (const a of values) for (const b of values) {
            for (const c of values) for (const d of values) {
                const queue = createQueue([a, b, c, d, -0, 0]);
                const x = Math.atan2(b, a);
                const y = Math.atan2(-c, d);
                const expected = x || y
                    ? [Math.cos(x), Math.sin(x), -Math.sin(y), Math.cos(y),
                        -14 * Math.cos(x) + 33 * Math.sin(y) - 0,
                        -14 * Math.sin(x) - 33 * Math.cos(y) + 0]
                    : [1, 0, 0, 1, -20.25, -10.5];
                vi.mocked($context.setTransform).mockClear();
                expect(execute(queue, 3)).toBe(queue.length);
                const actual = vi.mocked($context.setTransform).mock.calls[0];
                expect(actual.every((value, index) => Object.is(value, expected[index]))).toBe(true);
            }
        }
    });

    it("shares trigonometry only for identical axis angles", () =>
    {
        const same = createQueue([0.6, 0.8, -0.8, 0.6, 0, 0]);
        const sheared = createQueue([1, 0.5, 0.25, 2, 0, 0]);
        const cos = vi.spyOn(Math, "cos");
        const sin = vi.spyOn(Math, "sin");
        try {
            execute(same, 3);
            expect(cos).toHaveBeenCalledTimes(1);
            expect(sin).toHaveBeenCalledTimes(1);
            cos.mockClear();
            sin.mockClear();
            execute(sheared, 3);
            expect(cos).toHaveBeenCalledTimes(2);
            expect(sin).toHaveBeenCalledTimes(2);
        } finally {
            cos.mockRestore();
            sin.mockRestore();
        }
    });

    it.each([1, 2])("preserves bitmap mode %i transforms", mode =>
    {
        const queue = createQueue([2, 0.5, -0.25, 3, 50, 60], mode);
        expect(execute(queue, 3)).toBe(queue.length);
        expect($context.setTransform).toHaveBeenCalledExactlyOnceWith(
            ...(mode === 1
                ? [2, 0.5, -0.25, 3, 50, 60]
                : [1, 0.25, -0.25 / 3, 1, 38.75, 23.5])
        );
        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
    });

    it("keeps independent filter matrix and color views over the original queue", () =>
    {
        const first = createQueue([2, 0.5, -0.25, 3, 50, 60], 1, true);
        const second = createQueue([1, 0, 0, 1, -5, -6], 0, true);
        const subarray = vi.spyOn(first, "subarray");
        expect(execute(first, 3)).toBe(first.length);
        expect(execute(second, 3)).toBe(second.length);
        const calls = vi.mocked($context.applyFilter).mock.calls;
        expect(calls[0]).toEqual([
            mockNode, "56", true, 111, 91, true,
            new Float32Array([2, 0.5, -0.25, 3, 50, 60]),
            new Float32Array([0.5, 0.75, 1, 0.5, 10, 20, 30, 64]),
            "normal", new Float32Array([-25, -15, 100, 90]), new Float32Array([1, 2, 1])
        ]);
        expect(calls[0][6].buffer).toBe(first.buffer);
        expect(calls[0][6].byteOffset).toBe(first.byteOffset + 3 * 4);
        expect(calls[0][7].buffer).toBe(first.buffer);
        expect(calls[0][6]).not.toBe(calls[1][6]);
        expect(subarray).toHaveBeenCalledTimes(4);
        expect($context.drawDisplayObject).not.toHaveBeenCalled();
    });

    it.each([0, 1, 2])("preserves cache-miss command offsets in mode %i", mode =>
    {
        const cached = createQueue([1, 0, 0, 1, 50, 60], mode);
        const data = Array.from(cached);
        data[33] = 0; // hasCache
        data.splice(34, 0, 2, 100, 200); // command length and commands
        const queue = new Float32Array(data);
        expect(execute(queue, 3)).toBe(queue.length);
        expect($context.createNode).toHaveBeenCalledExactlyOnceWith(
            ...(mode === 1 ? [50, 60] : [100, 180])
        );
        expect($context.drawFill).toHaveBeenCalledTimes(1);
        expect($context.drawDisplayObject).toHaveBeenCalledExactlyOnceWith(
            mockNode, -20.25, -10.5, 90.75, 80.25,
            queue, 9
        );
    });

    it("preserves scale9-grid data and the following command offset", () =>
    {
        const data = Array.from(createQueue([1, 0, 0, 1, 50, 60]));
        data[25] = 1; // isGridEnabled
        data[33] = 0; // hasCache
        const grid = Array.from({ "length": 24 }, (_, index) => index + 1);
        data.splice(34, 0, ...grid, 2, 100, 200);
        const queue = new Float32Array(data);
        expect(execute(queue, 3)).toBe(queue.length);
        expect($context.useGrid).toHaveBeenCalledExactlyOnceWith(
            new Float32Array([...grid, 0, 0, 0, 0])
        );
        expect($context.drawFill).toHaveBeenCalledTimes(1);
        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
    });

    it("preserves packed pixel byte offsets and the following command offset", () =>
    {
        const data = Array.from(createQueue([1, 0, 0, 1, 50, 60], 1));
        data[26] = 0; // isDrawable
        data[33] = 0; // hasCache
        data.splice(34, 0, 6, 0, 0); // Six packed bytes occupy two floats.
        const storage = new Float32Array(data.length + 5);
        storage.set(data, 5);
        const queue = storage.subarray(5);
        const pixels = new Uint8Array(queue.buffer, queue.byteOffset + 35 * 4, 6);
        pixels.set([1, 2, 3, 4, 5, 6]);
        expect(execute(queue, 3)).toBe(queue.length);
        expect($context.drawPixels).toHaveBeenCalledExactlyOnceWith(mockNode, pixels);
        const uploaded = vi.mocked($context.drawPixels).mock.calls[0][1];
        expect(uploaded.buffer).toBe(queue.buffer);
        expect(uploaded.byteOffset).toBe(queue.byteOffset + 35 * 4);
        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        expect($context.drawFill).not.toHaveBeenCalled();
    });
});
