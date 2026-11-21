import { execute } from "./BezierConverterAdaptiveCubicToQuadUseCase";
import { $getCubicSegmentCount } from "../../BezierConverter";
import { describe, expect, it } from "vitest";

// 3 次ベジェ曲線上の点
const cubicPoint = (t: number, a: number, b: number, c: number, d: number): number =>
{
    const m = 1 - t;
    return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d;
};

// 2 次ベジェ曲線上の点
const quadPoint = (t: number, a: number, b: number, c: number): number =>
{
    const m = 1 - t;
    return m * m * a + 2 * m * t * b + t * t * c;
};

// 変換結果 (2 次ベジェ曲線の列) の各点が、もとの 3 次ベジェ曲線からどれだけ離れているか
const maxDistance = (curve: number[], count: number, buffer: Float32Array): number =>
{
    const truth: number[][] = [];
    for (let idx = 0; idx <= 800; ++idx) {
        const t = idx / 800;
        truth.push([
            cubicPoint(t, curve[0], curve[2], curve[4], curve[6]),
            cubicPoint(t, curve[1], curve[3], curve[5], curve[7])
        ]);
    }

    let worst = 0;
    let fromX = curve[0];
    let fromY = curve[1];
    for (let segment = 0; segment < count; ++segment) {
        const offset = segment * 4;
        for (let idx = 0; idx <= 20; ++idx) {
            const t = idx / 20;
            const x = quadPoint(t, fromX, buffer[offset], buffer[offset + 2]);
            const y = quadPoint(t, fromY, buffer[offset + 1], buffer[offset + 3]);
            // もとの曲線を細かい折れ線にしたものまでの距離 (点ではなく線分までの距離で測る)
            let best = Infinity;
            for (let p = 1; p < truth.length; ++p) {
                const ax = truth[p - 1][0];
                const ay = truth[p - 1][1];
                const bx = truth[p][0] - ax;
                const by = truth[p][1] - ay;
                const lengthSquared = bx * bx + by * by;
                let u = lengthSquared > 0 ? ((x - ax) * bx + (y - ay) * by) / lengthSquared : 0;
                u = u < 0 ? 0 : u > 1 ? 1 : u;
                best = Math.min(best, Math.hypot(ax + bx * u - x, ay + by * u - y));
            }
            worst = Math.max(worst, best);
        }
        fromX = buffer[offset + 2];
        fromY = buffer[offset + 3];
    }
    return worst;
};

const curves: number[][] = [
    [17.28, 0, 16.91, 0, 16.48, 0.02, 16.01, 0.07],
    [13.71, 1.42, 9.75, 7.07, 3.78, 13.74, 1, 16.39],
    [0.03, 19.07, 0.41, 22.38, 2.72, 24.36, 6.23, 24.36],
    [50, 0, 50, 27.6, 27.6, 50, 0, 50],
    [200, 0, 200, 110.4, 110.4, 200, 0, 200],
    [0, 0, 60, 0, 0, 60, 60, 60]
];

describe("BezierConverter cubic segment count test", () =>
{
    it("a curve that is already quadratic needs one segment", () =>
    {
        // 2 次ベジェ曲線 (0,0)-(30,60)-(60,0) を 3 次に上げたもの
        expect($getCubicSegmentCount(0, 0, 20, 40, 40, 40, 60, 0, 4)).toBe(1);
    });

    it("small curves need fewer segments than large ones", () =>
    {
        const small = $getCubicSegmentCount(17.28, 0, 16.91, 0, 16.48, 0.02, 16.01, 0.07, 1.5);
        const large = $getCubicSegmentCount(200, 0, 200, 110.4, 110.4, 200, 0, 200, 1.5);
        expect(small).toBe(1);
        expect(large).toBeGreaterThan(small);
    });

    it("the count grows with the on-screen scale and never exceeds 8", () =>
    {
        const curve = curves[3];
        let previous = 0;
        for (const scale of [0.25, 1, 4, 16, 1000]) {
            const count = $getCubicSegmentCount(
                curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], curve[6], curve[7], scale
            );
            expect(count).toBeGreaterThanOrEqual(previous);
            expect(count).toBeGreaterThanOrEqual(1);
            expect(count).toBeLessThanOrEqual(8);
            previous = count;
        }
        expect(previous).toBe(8);
    });

    it("the converted curve stays within the tolerance on screen", () =>
    {
        for (const scale of [0.5, 1, 1.5, 3]) {
            for (const curve of curves) {
                const result = execute(
                    curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], curve[6], curve[7], scale
                );

                // 最後の点はもとの曲線の終点
                const last = (result.count - 1) * 4;
                expect(result.buffer[last + 2]).toBeCloseTo(curve[6], 4);
                expect(result.buffer[last + 3]).toBeCloseTo(curve[7], 4);

                // 上限の 8 本に達していなければ、画面上の誤差は 0.05 ピクセル以内。
                // 結果は単精度 (Float32Array) に入るので、その丸めの分として 1% を見込む
                if (result.count < 8) {
                    const distance = maxDistance(curve, result.count, result.buffer);
                    expect(distance * scale).toBeLessThanOrEqual(0.05 * 1.01);
                }
            }
        }
    });

    it("without a scale the previous subdivision is used", () =>
    {
        const curve = curves[0];
        const result = execute(
            curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], curve[6], curve[7]
        );
        expect(result.count).toBe(2);
    });
});
