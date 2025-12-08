import { execute } from "./GradientLUTInterpolateColorService";
import type { IGradientStop } from "./GradientLUTParseStopsService";
import { describe, expect, it } from "vitest";

describe("GradientLUTInterpolateColorService.ts method test", () =>
{
    it("test case - interpolate at t=0 returns start color (RGB mode)", () =>
    {
        const startStop: IGradientStop = { ratio: 0, r: 1, g: 0, b: 0, a: 1 };
        const endStop: IGradientStop = { ratio: 1, r: 0, g: 0, b: 1, a: 1 };

        const result = execute(startStop, endStop, 0, 0);

        expect(result.r).toBe(1);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
        expect(result.a).toBe(1);
    });

    it("test case - interpolate at t=1 returns end color (RGB mode)", () =>
    {
        const startStop: IGradientStop = { ratio: 0, r: 1, g: 0, b: 0, a: 1 };
        const endStop: IGradientStop = { ratio: 1, r: 0, g: 0, b: 1, a: 1 };

        const result = execute(startStop, endStop, 1, 0);

        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(1);
        expect(result.a).toBe(1);
    });

    it("test case - interpolate at t=0.5 returns midpoint (RGB mode)", () =>
    {
        const startStop: IGradientStop = { ratio: 0, r: 0, g: 0, b: 0, a: 0 };
        const endStop: IGradientStop = { ratio: 1, r: 1, g: 1, b: 1, a: 1 };

        const result = execute(startStop, endStop, 0.5, 0);

        expect(result.r).toBe(0.5);
        expect(result.g).toBe(0.5);
        expect(result.b).toBe(0.5);
        expect(result.a).toBe(0.5);
    });

    it("test case - interpolate with Linear RGB mode (interpolation=1)", () =>
    {
        const startStop: IGradientStop = { ratio: 0, r: 0, g: 0, b: 0, a: 0 };
        const endStop: IGradientStop = { ratio: 1, r: 1, g: 1, b: 1, a: 1 };

        const result = execute(startStop, endStop, 0.5, 1);

        // Linear RGB補間では結果が異なる
        expect(result.r).toBeGreaterThan(0);
        expect(result.r).toBeLessThan(1);
        expect(result.a).toBe(0.5); // アルファは常に線形補間
    });

    it("test case - alpha is always linearly interpolated", () =>
    {
        const startStop: IGradientStop = { ratio: 0, r: 1, g: 1, b: 1, a: 0 };
        const endStop: IGradientStop = { ratio: 1, r: 1, g: 1, b: 1, a: 1 };

        const resultRGB = execute(startStop, endStop, 0.5, 0);
        const resultLinear = execute(startStop, endStop, 0.5, 1);

        expect(resultRGB.a).toBe(0.5);
        expect(resultLinear.a).toBe(0.5);
    });
});
