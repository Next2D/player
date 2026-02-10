import { describe, it, expect } from "vitest";
import { execute } from "./BezierConverterCalculateFlatnessService";

describe("BezierConverterCalculateFlatnessService", () =>
{
    it("should return 0 for a straight line (control points on line)", () =>
    {
        // 直線の場合はフラットネス0
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 1, y: 1 };
        const p2 = { x: 2, y: 2 };
        const p3 = { x: 3, y: 3 };

        const flatness = execute(p0, p1, p2, p3);
        expect(flatness).toBeCloseTo(0, 5);
    });

    it("should return positive value for curved bezier", () =>
    {
        // 曲線の場合は正のフラットネス
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 0, y: 10 };  // 制御点が大きく外れている
        const p2 = { x: 10, y: 10 };
        const p3 = { x: 10, y: 0 };

        const flatness = execute(p0, p1, p2, p3);
        expect(flatness).toBeGreaterThan(0);
    });

    it("should return larger value for more curved bezier", () =>
    {
        // より曲がった曲線はより大きなフラットネス
        const p0 = { x: 0, y: 0 };
        const p3 = { x: 10, y: 0 };

        // 少し曲がった曲線
        const p1a = { x: 3, y: 2 };
        const p2a = { x: 7, y: 2 };
        const flatness1 = execute(p0, p1a, p2a, p3);

        // 大きく曲がった曲線
        const p1b = { x: 3, y: 10 };
        const p2b = { x: 7, y: 10 };
        const flatness2 = execute(p0, p1b, p2b, p3);

        expect(flatness2).toBeGreaterThan(flatness1);
    });

    it("should handle degenerate case where start equals end", () =>
    {
        // 始点と終点が同じ場合
        const p0 = { x: 5, y: 5 };
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 10, y: 10 };
        const p3 = { x: 5, y: 5 };

        const flatness = execute(p0, p1, p2, p3);
        expect(flatness).toBeGreaterThan(0);
        // 制御点からの距離の2乗が返される
        expect(flatness).toEqual(50); // max((5-0)^2 + (5-0)^2, (5-10)^2 + (5-10)^2) = 50
    });

    it("should be symmetric for symmetric control points", () =>
    {
        // 対称な制御点では対称なフラットネス
        const p0 = { x: 0, y: 0 };
        const p3 = { x: 10, y: 0 };

        const p1a = { x: 2, y: 5 };
        const p2a = { x: 8, y: 5 };
        const flatness1 = execute(p0, p1a, p2a, p3);

        const p1b = { x: 8, y: 5 };
        const p2b = { x: 2, y: 5 };
        const flatness2 = execute(p0, p1b, p2b, p3);

        expect(flatness1).toBeCloseTo(flatness2, 5);
    });
});
