import { execute } from "./MeshGenerateStrokeOutlineUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../WebGLUtil.ts", () => ({
    "$context": {
        "joints": 0,
        // 描画行列 (等倍)。線の曲線の分割数を決めるのに使われる
        "$matrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
        "caps": 0
    }
}));

describe("MeshGenerateStrokeOutlineUseCase.js method test", () =>
{
    it("test case - generate stroke outline with straight lines", () =>
    {
        const vertices = [
            0, 0, false,
            100, 0, false
        ];

        const result = execute(vertices, 2);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBeDefined();
        expect(result[0].length).toBeGreaterThan(0);
    });
});
