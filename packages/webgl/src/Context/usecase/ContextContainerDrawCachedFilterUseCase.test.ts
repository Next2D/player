import { execute } from "./ContextContainerDrawCachedFilterUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("@next2d/cache", () => ({
    "$cacheStore": {
        "get": vi.fn()
    }
}));

vi.mock("../../WebGLUtil", () => ({
    "$context": {
        "drawArraysInstanced": vi.fn(),
        "reset": vi.fn(),
        "globalCompositeOperation": "normal"
    },
    "$devicePixelRatio": 1
}));

vi.mock("../../Blend/usecase/BlendDrawFilterToMainUseCase", () => ({
    "execute": vi.fn()
}));

describe("ContextContainerDrawCachedFilterUseCase.js test", () => {

    it("execute test case1 - returns early if cached key does not match", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        const blendMod = await import("../../Blend/usecase/BlendDrawFilterToMainUseCase");

        vi.mocked($cacheStore.get).mockImplementation((key: string, prop: string) => {
            if (prop === "fKey") { return "old_key"; }
            return null;
        });
        vi.mocked(blendMod.execute).mockClear();

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const filterBounds = new Float32Array([-5, -5, 110, 110]);

        execute("normal", matrix, colorTransform, filterBounds, "1", "new_key");

        expect(blendMod.execute).not.toHaveBeenCalled();
    });

    it("execute test case2 - returns early if no texture object", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        const blendMod = await import("../../Blend/usecase/BlendDrawFilterToMainUseCase");

        vi.mocked($cacheStore.get).mockImplementation((_key: string, prop: string) => {
            if (prop === "fKey") { return "match_key"; }
            if (prop === "fTexture") { return null; }
            return null;
        });
        vi.mocked(blendMod.execute).mockClear();

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const filterBounds = new Float32Array([-5, -5, 110, 110]);

        execute("normal", matrix, colorTransform, filterBounds, "1", "match_key");

        expect(blendMod.execute).not.toHaveBeenCalled();
    });

    it("execute test case3 - draws cached filter when key matches", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        const { $context } = await import("../../WebGLUtil");
        const blendMod = await import("../../Blend/usecase/BlendDrawFilterToMainUseCase");

        const mockTexture = { "width": 100, "height": 100 };
        vi.mocked($cacheStore.get).mockImplementation((_key: string, prop: string) => {
            if (prop === "fKey") { return "valid_key"; }
            if (prop === "fTexture") { return mockTexture; }
            return null;
        });
        vi.mocked($context.drawArraysInstanced).mockClear();
        vi.mocked($context.reset).mockClear();
        vi.mocked(blendMod.execute).mockClear();

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const filterBounds = new Float32Array([-5, -5, 110, 110]);

        execute("add", matrix, colorTransform, filterBounds, "1", "valid_key");

        expect($context.drawArraysInstanced).toHaveBeenCalledTimes(1);
        expect($context.reset).toHaveBeenCalledTimes(1);
        expect($context.globalCompositeOperation).toBe("add");
        expect(blendMod.execute).toHaveBeenCalledTimes(1);
    });
});
