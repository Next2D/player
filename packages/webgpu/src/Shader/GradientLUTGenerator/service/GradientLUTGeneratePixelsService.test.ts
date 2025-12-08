import { execute } from "./GradientLUTGeneratePixelsService";
import type { IGradientStop } from "./GradientLUTParseStopsService";
import { describe, expect, it } from "vitest";

describe("GradientLUTGeneratePixelsService.ts method test", () =>
{
    it("test case - empty stops returns empty array", () =>
    {
        const stops: IGradientStop[] = [];

        const result = execute(stops, 64, 0);

        expect(result.length).toBe(64 * 4);
        expect(result.every(v => v === 0)).toBe(true);
    });

    it("test case - single stop fills with same color", () =>
    {
        const stops: IGradientStop[] = [
            { ratio: 0.5, r: 1, g: 0, b: 0, a: 1 }
        ];

        const result = execute(stops, 4, 0);

        expect(result.length).toBe(16);
        // 全ピクセルが同じ色（赤）
        for (let i = 0; i < 4; i++) {
            expect(result[i * 4]).toBe(255);     // r
            expect(result[i * 4 + 1]).toBe(0);   // g
            expect(result[i * 4 + 2]).toBe(0);   // b
            expect(result[i * 4 + 3]).toBe(255); // a
        }
    });

    it("test case - two stops gradient from red to blue", () =>
    {
        const stops: IGradientStop[] = [
            { ratio: 0, r: 1, g: 0, b: 0, a: 1 },
            { ratio: 1, r: 0, g: 0, b: 1, a: 1 }
        ];

        const result = execute(stops, 3, 0);

        // ピクセル0: 赤
        expect(result[0]).toBe(255);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);

        // ピクセル1: 紫（中間）
        expect(result[4]).toBe(128);
        expect(result[5]).toBe(0);
        expect(result[6]).toBe(128);

        // ピクセル2: 青
        expect(result[8]).toBe(0);
        expect(result[9]).toBe(0);
        expect(result[10]).toBe(255);
    });

    it("test case - alpha channel interpolation", () =>
    {
        const stops: IGradientStop[] = [
            { ratio: 0, r: 1, g: 1, b: 1, a: 0 },
            { ratio: 1, r: 1, g: 1, b: 1, a: 1 }
        ];

        const result = execute(stops, 3, 0);

        // ピクセル0: alpha=0
        expect(result[3]).toBe(0);

        // ピクセル1: alpha=0.5
        expect(result[7]).toBe(128);

        // ピクセル2: alpha=1
        expect(result[11]).toBe(255);
    });

    it("test case - three stops gradient", () =>
    {
        const stops: IGradientStop[] = [
            { ratio: 0, r: 1, g: 0, b: 0, a: 1 },   // 赤
            { ratio: 0.5, r: 0, g: 1, b: 0, a: 1 }, // 緑
            { ratio: 1, r: 0, g: 0, b: 1, a: 1 }    // 青
        ];

        const result = execute(stops, 5, 0);

        // ピクセル0: 赤
        expect(result[0]).toBe(255);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);

        // ピクセル2: 緑
        expect(result[8]).toBe(0);
        expect(result[9]).toBe(255);
        expect(result[10]).toBe(0);

        // ピクセル4: 青
        expect(result[16]).toBe(0);
        expect(result[17]).toBe(0);
        expect(result[18]).toBe(255);
    });
});
