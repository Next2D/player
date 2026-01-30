import { describe, it, expect } from "vitest";
import { execute } from "./BezierConverterSplitCubicService";

describe("BezierConverterSplitCubicService", () =>
{
    it("should split a straight line correctly", () =>
    {
        const p0 = { "x": 0, "y": 0 };
        const p1 = { "x": 10, "y": 0 };
        const p2 = { "x": 20, "y": 0 };
        const p3 = { "x": 30, "y": 0 };

        const result = execute(p0, p1, p2, p3);

        // 分割点は中央にあるはず
        expect(result.first[3].x).toBeCloseTo(15, 5);
        expect(result.first[3].y).toBeCloseTo(0, 5);
        expect(result.second[0].x).toBeCloseTo(15, 5);
        expect(result.second[0].y).toBeCloseTo(0, 5);
    });

    it("should preserve start and end points", () =>
    {
        const p0 = { "x": 0, "y": 0 };
        const p1 = { "x": 10, "y": 20 };
        const p2 = { "x": 20, "y": 20 };
        const p3 = { "x": 30, "y": 0 };

        const result = execute(p0, p1, p2, p3);

        // 始点は保持
        expect(result.first[0]).toEqual(p0);
        // 終点は保持
        expect(result.second[3]).toEqual(p3);
    });

    it("should have continuous split point", () =>
    {
        const p0 = { "x": 0, "y": 0 };
        const p1 = { "x": 5, "y": 10 };
        const p2 = { "x": 15, "y": 10 };
        const p3 = { "x": 20, "y": 0 };

        const result = execute(p0, p1, p2, p3);

        // 前半の終点と後半の始点は一致
        expect(result.first[3].x).toBeCloseTo(result.second[0].x, 10);
        expect(result.first[3].y).toBeCloseTo(result.second[0].y, 10);
    });

    it("should return 4 points for each half", () =>
    {
        const p0 = { "x": 0, "y": 0 };
        const p1 = { "x": 1, "y": 2 };
        const p2 = { "x": 3, "y": 2 };
        const p3 = { "x": 4, "y": 0 };

        const result = execute(p0, p1, p2, p3);

        expect(result.first.length).toBe(4);
        expect(result.second.length).toBe(4);
    });

    it("should handle symmetric curve", () =>
    {
        const p0 = { "x": 0, "y": 0 };
        const p1 = { "x": 0, "y": 10 };
        const p2 = { "x": 10, "y": 10 };
        const p3 = { "x": 10, "y": 0 };

        const result = execute(p0, p1, p2, p3);

        // 対称な曲線なので分割点はx=5にあるはず
        expect(result.first[3].x).toBeCloseTo(5, 5);
    });

    it("should calculate midpoints correctly using De Casteljau", () =>
    {
        const p0 = { "x": 0, "y": 0 };
        const p1 = { "x": 0, "y": 4 };
        const p2 = { "x": 4, "y": 4 };
        const p3 = { "x": 4, "y": 0 };

        const result = execute(p0, p1, p2, p3);

        // Level 1 midpoints
        const p01 = { "x": 0, "y": 2 };
        const p12 = { "x": 2, "y": 4 };
        const p23 = { "x": 4, "y": 2 };

        // Check first curve control points
        expect(result.first[1].x).toBeCloseTo(p01.x, 5);
        expect(result.first[1].y).toBeCloseTo(p01.y, 5);

        // Check second curve control points
        expect(result.second[2].x).toBeCloseTo(p23.x, 5);
        expect(result.second[2].y).toBeCloseTo(p23.y, 5);
    });
});
