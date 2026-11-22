import { describe, expect, it, vi } from "vitest";
import type { IPoint } from "../../interface/IPoint";

vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        "joints": 0,
        "caps": 0,
        "$matrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
    }
}));

import { calculateCurveRectangle } from "./MeshStrokeGenerateUseCase";

describe("MeshStrokeGenerateUseCase calculateCurveRectangle adaptive split test", () =>
{
    // 輪郭に含まれる区間の数 (左側と右側で同じ数。1 区間 = 制御点 + 終点 の 6 要素)
    const segmentCount = (paths: Array<number | boolean>): number => (paths.length - 6) / 12;

    // 輪郭上の点 (制御点ではない点) が、32 区間で作った輪郭の点列からどれだけ離れているか
    const maxDistance = (paths: Array<number | boolean>, reference: Array<number | boolean>): number =>
    {
        const points: number[][] = [];
        for (let idx = 0; idx < reference.length; idx += 3) {
            points.push([reference[idx] as number, reference[idx + 1] as number]);
        }
        let worst = 0;
        for (let idx = 0; idx < paths.length; idx += 3) {
            const x = paths[idx] as number;
            const y = paths[idx + 1] as number;
            let best = Infinity;
            for (let p = 0; p < points.length; ++p) {
                best = Math.min(best, Math.hypot(points[p][0] - x, points[p][1] - y));
            }
            worst = Math.max(worst, best);
        }
        return worst;
    };

    const curves: Array<[IPoint, IPoint, IPoint, number]> = [
        [{ "x": 90, "y": 120 }, { "x": 91, "y": 30 }, { "x": 210, "y": 100 }, 3],
        [{ "x": 17.28, "y": 0 }, { "x": 16.9, "y": 0.01 }, { "x": 16.01, "y": 0.07 }, 2],
        [{ "x": 13.71, "y": 1.42 }, { "x": 11.7, "y": 4.3 }, { "x": 9, "y": 7.6 }, 2],
        [{ "x": 0, "y": 0 }, { "x": 5, "y": 0 }, { "x": 5, "y": 5 }, 2],
        [{ "x": 0, "y": 0 }, { "x": 20, "y": 1 }, { "x": 40, "y": 0 }, 1.5]
    ];

    it("splits into 32 segments when the on-screen scale is unknown", () =>
    {
        for (const [start, control, end, thickness] of curves) {
            expect(segmentCount(calculateCurveRectangle(start, control, end, thickness))).toBe(32);
            expect(segmentCount(calculateCurveRectangle(start, control, end, thickness, 0))).toBe(32);
        }
    });

    it("uses fewer segments for small curves and keeps the outline within the tolerance", () =>
    {
        for (const scale of [0.5, 1, 2, 4]) {
            for (const [start, control, end, thickness] of curves) {
                const reference = calculateCurveRectangle(start, control, end, thickness).slice();
                const paths = calculateCurveRectangle(start, control, end, thickness, scale);

                const count = segmentCount(paths);
                expect([1, 2, 4, 8, 16, 32]).toContain(count);

                // 輪郭上の点は、32 区間の輪郭から画面上で 0.05 ピクセル以内
                expect(maxDistance(paths, reference) * scale).toBeLessThanOrEqual(0.05);

                // 両端の点は分割数に関係なく同じ
                expect(paths[0]).toBeCloseTo(reference[0] as number, 9);
                expect(paths[1]).toBeCloseTo(reference[1] as number, 9);
            }
        }

        // 小さな曲線 (文字の縁取りのような大きさ) は 1〜2 区間で足りる
        const [start, control, end, thickness] = curves[1];
        expect(segmentCount(calculateCurveRectangle(start, control, end, thickness, 1.5))).toBeLessThanOrEqual(2);
    });

    it("uses more segments as the on-screen scale grows", () =>
    {
        const [start, control, end, thickness] = curves[3];
        const small = segmentCount(calculateCurveRectangle(start, control, end, thickness, 0.5));
        const large = segmentCount(calculateCurveRectangle(start, control, end, thickness, 8));
        expect(large).toBeGreaterThan(small);
    });

    it("uses the maximum for a curve that nearly folds back", () =>
    {
        const paths = calculateCurveRectangle({ "x": 0, "y": 0 }, { "x": 10, "y": 0 }, { "x": 0, "y": 2 }, 2, 1);
        expect(segmentCount(paths)).toBe(32);
    });
});
