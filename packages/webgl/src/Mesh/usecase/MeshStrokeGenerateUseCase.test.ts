import { execute } from "./MeshStrokeGenerateUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../WebGLUtil.ts", () => ({
    "$context": {
        "thickness": 4,
        "joints": 0,
        "caps": 0,
        "$fillStyle": new Float32Array([0, 0, 0, 1]),
        "$strokeStyle": new Float32Array([0, 0, 0, 1]),
        "$matrix": new Float32Array([1, 0, 0, 1, 0, 0, 0, 0, 1])
    },
    "$getViewportWidth": () => 1024,
    "$getViewportHeight": () => 1024
}));

describe("MeshStrokeGenerateUseCase.js method test", () =>
{
    it("test case - generate stroke mesh", () =>
    {
        const vertices = [
            [0, 0, false, 100, 0, false]
        ];

        const result = execute(vertices);
        expect(result).toBeDefined();
        expect(result.buffer).toBeDefined();
        expect(result.indexCount).toBeGreaterThan(0);
    });
});
