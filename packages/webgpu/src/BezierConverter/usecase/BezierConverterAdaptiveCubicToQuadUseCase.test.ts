import { describe, it, expect } from "vitest";
import { execute, calculateAdaptiveThreshold } from "./BezierConverterAdaptiveCubicToQuadUseCase";

describe("BezierConverterAdaptiveCubicToQuadUseCase", () =>
{
    it("should convert straight line to single segment", () =>
    {
        // 直線に近い曲線は1セグメントに
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 1, y: 0.1 };  // ほぼ直線
        const p2 = { x: 2, y: 0.1 };
        const p3 = { x: 3, y: 0 };

        const segments = execute(p0, p1, p2, p3, 4.0);

        // 直線に近いので少ないセグメント
        expect(segments.length).toBeLessThanOrEqual(2);
        expect(segments.length).toBeGreaterThanOrEqual(1);
    });

    it("should create more segments for complex curve", () =>
    {
        // 複雑な曲線は多いセグメントに
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 0, y: 100 };  // 大きく曲がる
        const p2 = { x: 100, y: 100 };
        const p3 = { x: 100, y: 0 };

        const segments = execute(p0, p1, p2, p3, 4.0);

        // 複雑なので多いセグメント
        expect(segments.length).toBeGreaterThan(1);
    });

    it("should respect flatness threshold", () =>
    {
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 0, y: 50 };
        const p2 = { x: 100, y: 50 };
        const p3 = { x: 100, y: 0 };

        // 低い閾値 = 高品質 = 多いセグメント
        const highQuality = execute(p0, p1, p2, p3, 1.0);

        // 高い閾値 = 低品質 = 少ないセグメント
        const lowQuality = execute(p0, p1, p2, p3, 100.0);

        expect(highQuality.length).toBeGreaterThanOrEqual(lowQuality.length);
    });

    it("should end at correct point", () =>
    {
        const p0 = { x: 10, y: 20 };
        const p1 = { x: 30, y: 40 };
        const p2 = { x: 50, y: 60 };
        const p3 = { x: 70, y: 80 };

        const segments = execute(p0, p1, p2, p3);

        // 最後のセグメントの終点が元の終点と一致
        const lastSegment = segments[segments.length - 1];
        expect(lastSegment.end.x).toBeCloseTo(p3.x, 5);
        expect(lastSegment.end.y).toBeCloseTo(p3.y, 5);
    });

    it("should create valid quadratic bezier segments", () =>
    {
        const p0 = { x: 0, y: 0 };
        const p1 = { x: 25, y: 50 };
        const p2 = { x: 75, y: 50 };
        const p3 = { x: 100, y: 0 };

        const segments = execute(p0, p1, p2, p3);

        // 各セグメントが有効な構造を持つ
        for (const segment of segments) {
            expect(segment).toHaveProperty("ctrl");
            expect(segment).toHaveProperty("end");
            expect(typeof segment.ctrl.x).toBe("number");
            expect(typeof segment.ctrl.y).toBe("number");
            expect(typeof segment.end.x).toBe("number");
            expect(typeof segment.end.y).toBe("number");
        }
    });
});

describe("calculateAdaptiveThreshold", () =>
{
    it("should return smaller threshold for larger scale", () =>
    {
        const threshold1 = calculateAdaptiveThreshold(1.0);
        const threshold2 = calculateAdaptiveThreshold(2.0);

        expect(threshold2).toBeLessThan(threshold1);
    });

    it("should return larger threshold for smaller scale", () =>
    {
        const threshold1 = calculateAdaptiveThreshold(1.0);
        const threshold2 = calculateAdaptiveThreshold(0.5);

        expect(threshold2).toBeGreaterThan(threshold1);
    });

    it("should clamp to minimum threshold", () =>
    {
        // 非常に大きなスケールでも最小値を下回らない
        const threshold = calculateAdaptiveThreshold(100.0);
        expect(threshold).toBeGreaterThanOrEqual(0.25);
    });

    it("should clamp to maximum threshold", () =>
    {
        // 非常に小さなスケールでも最大値を超えない
        const threshold = calculateAdaptiveThreshold(0.01);
        expect(threshold).toBeLessThanOrEqual(16.0);
    });
});
