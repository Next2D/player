import { execute } from "./GradientLUTSetUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("GradientLUTSetUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set gradient uniform from stops", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        // stops format: [ratio, r_idx, g_idx, b_idx, a_idx, ...]
        const stops = [
            0, 0, 1, 2, 3,    // first stop
            255, 4, 5, 6, 7   // second stop
        ];

        // table with color values
        const table = new Float32Array([
            1, 0, 0, 1,       // RGBA at indices 0-3
            0, 0, 1, 0.5      // RGBA at indices 4-7
        ]);

        execute(mockShaderManager, stops, 0, 2, table);

        // Check first color (from table indices 0,1,2,3)
        expect(mediump[0]).toBe(1);   // table[0]
        expect(mediump[1]).toBe(0);   // table[1]
        expect(mediump[2]).toBe(0);   // table[2]
        expect(mediump[3]).toBe(1);   // table[3]

        // Check second color (from table indices 4,5,6,7)
        expect(mediump[4]).toBe(0);   // table[4]
        expect(mediump[5]).toBe(0);   // table[5]
        expect(mediump[6]).toBe(1);   // table[6]
        expect(mediump[7]).toBe(0.5); // table[7]

        // Check ratios (u_gradient_t)
        expect(mediump[8]).toBe(0);   // stops[0]
        expect(mediump[9]).toBe(255); // stops[5]
    });

    it("test case - should handle partial range", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const stops = [
            0, 0, 1, 2, 3,
            127, 4, 5, 6, 7,
            255, 8, 9, 10, 11
        ];

        const table = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]);

        execute(mockShaderManager, stops, 1, 3, table);

        // First color in range should be from stops[1]
        expect(mediump[0]).toBe(0);   // table[4]
        expect(mediump[1]).toBe(1);   // table[5]
        expect(mediump[2]).toBe(0);   // table[6]
        expect(mediump[3]).toBe(1);   // table[7]

        // Check ratios
        expect(mediump[8]).toBe(127); // stops[5] (second stop ratio)
        expect(mediump[9]).toBe(255); // stops[10] (third stop ratio)
    });

    it("test case - should process single stop", () =>
    {
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const stops = [128, 0, 1, 2, 3];
        const table = new Float32Array([0.5, 0.6, 0.7, 0.8]);

        execute(mockShaderManager, stops, 0, 1, table);

        expect(mediump[0]).toBeCloseTo(0.5, 5);
        expect(mediump[1]).toBeCloseTo(0.6, 5);
        expect(mediump[2]).toBeCloseTo(0.7, 5);
        expect(mediump[3]).toBeCloseTo(0.8, 5);
        expect(mediump[4]).toBe(128);  // ratio
    });
});

describe("GradientLUTSetUniformService.ts shared shader padding", () =>
{
    it("pads missing stops with the last stop when the shader is the shared 8-stop one", () =>
    {
        // 共用のシェーダー (8 ストップ用): vec4 が 10 個 (色 8 + 位置 2)
        const mediump = new Float32Array(10 * 4).fill(-1);
        const mockShaderManager = {
            "mediump": mediump
        } as unknown as ShaderManager;

        const stops = [
            0,   0, 1, 2, 3,
            127, 4, 5, 6, 7,
            255, 8, 9, 10, 11
        ];
        const table = new Float32Array(12);
        for (let idx = 0; idx < 12; ++idx) {
            table[idx] = idx / 16;
        }

        execute(mockShaderManager, stops, 0, 3, table);

        // 色: 3 個 + 最後の色で 5 個分を埋める
        for (let idx = 0; idx < 12; ++idx) {
            expect(mediump[idx]).toBe(idx / 16);
        }
        for (let stop = 3; stop < 8; ++stop) {
            expect(mediump[stop * 4]).toBe(8 / 16);
            expect(mediump[stop * 4 + 1]).toBe(9 / 16);
            expect(mediump[stop * 4 + 2]).toBe(10 / 16);
            expect(mediump[stop * 4 + 3]).toBe(11 / 16);
        }

        // 位置: 色 8 個の後ろから。足りない分は最後の位置
        expect(Array.from(mediump.subarray(32, 40))).toEqual([0, 127, 255, 255, 255, 255, 255, 255]);
    });

    it("does not pad when all 8 stops are given", () =>
    {
        const mediump = new Float32Array(10 * 4).fill(-1);
        const mockShaderManager = {
            "mediump": mediump
        } as unknown as ShaderManager;

        const stops: number[] = [];
        for (let idx = 0; idx < 8; ++idx) {
            stops.push(idx * 30, 0, 0, 0, 0);
        }

        execute(mockShaderManager, stops, 0, 8, new Float32Array([0.5]));

        expect(Array.from(mediump.subarray(0, 32))).toEqual(new Array(32).fill(0.5));
        expect(Array.from(mediump.subarray(32, 40))).toEqual([0, 30, 60, 90, 120, 150, 180, 210]);
    });
});
