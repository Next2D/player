import { execute } from "./MeshCalculateCurveRectangleUseCase";
import { execute as meshSplitBezierMultipleTimesUseCase } from "./MeshSplitBezierMultipleTimesUseCase";
import { execute as meshApproximateOffsetQuadraticUseCase } from "./MeshApproximateOffsetQuadraticUseCase";
import { describe, expect, it } from "vitest";
import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";

/**
 * 点や区間ごとにオブジェクトを作る素直な実装 (分割と、区間ごとのずらしを個別のユースケースで行う)。
 * execute はこれと同じ値を、作業領域を使い回して計算する。
 */
const reference = (start: IPoint, control: IPoint, end: IPoint, thickness: number): IPath =>
{
    const segments = meshSplitBezierMultipleTimesUseCase(start, control, end, 5);

    const leftCurves: Array<IPoint[]> = [];
    const rightCurves: Array<IPoint[]> = [];
    for (let idx = 0; idx < segments.length; ++idx) {
        const [s0, s1, s2] = segments[idx];
        leftCurves.push(meshApproximateOffsetQuadraticUseCase(s0, s1, s2, +thickness));
        rightCurves.push(meshApproximateOffsetQuadraticUseCase(s0, s1, s2, -thickness));
    }

    const paths: IPath = [leftCurves[0][0].x, leftCurves[0][0].y, false];
    for (let idx = 0; idx < leftCurves.length; ++idx) {
        const curves = leftCurves[idx];
        paths.push(curves[1].x, curves[1].y, true, curves[2].x, curves[2].y, false);
    }

    const reversed = [...rightCurves].reverse().map(([q0, q1, q2]) => [q2, q1, q0]);
    paths.push(reversed[0][0].x, reversed[0][0].y, false);
    for (let idx = 0; idx < reversed.length; ++idx) {
        const curves = reversed[idx];
        paths.push(curves[1].x, curves[1].y, true, curves[2].x, curves[2].y, false);
    }
    return paths;
};

// 再現できる乱数 (mulberry32)
const random = (seed: number): (() => number) =>
{
    return (): number => {
        seed |= 0;
        seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};

describe("MeshCalculateCurveRectangleUseCase.js equivalence test", () =>
{
    it("returns exactly the same outline as the straightforward implementation", () =>
    {
        const next = random(20261121);
        for (let count = 0; count < 300; ++count) {
            const start   = { "x": next() * 2000 - 1000, "y": next() * 2000 - 1000 };
            const control = { "x": next() * 2000 - 1000, "y": next() * 2000 - 1000 };
            const end     = { "x": next() * 2000 - 1000, "y": next() * 2000 - 1000 };
            const thickness = next() * 40;
            expect(execute(start, control, end, thickness))
                .toStrictEqual(reference(start, control, end, thickness));
        }
    });

    it("matches for values that came through a Float32Array", () =>
    {
        const next = random(7);
        const values = new Float32Array(7);
        for (let count = 0; count < 100; ++count) {
            for (let idx = 0; idx < values.length; ++idx) {
                values[idx] = next() * 500;
            }
            const start   = { "x": values[0], "y": values[1] };
            const control = { "x": values[2], "y": values[3] };
            const end     = { "x": values[4], "y": values[5] };
            expect(execute(start, control, end, values[6]))
                .toStrictEqual(reference(start, control, end, values[6]));
        }
    });

    it("matches for degenerate curves (coincident points, straight line, zero thickness)", () =>
    {
        const cases: Array<[IPoint, IPoint, IPoint, number]> = [
            [{ "x": 5, "y": 5 }, { "x": 5, "y": 5 }, { "x": 5, "y": 5 }, 3],
            [{ "x": 0, "y": 0 }, { "x": 0, "y": 0 }, { "x": 10, "y": 0 }, 2],
            [{ "x": 0, "y": 0 }, { "x": 5, "y": 5 }, { "x": 10, "y": 10 }, 1.5],
            [{ "x": -3, "y": 8 }, { "x": 40, "y": -20 }, { "x": -3, "y": 8 }, 4],
            [{ "x": 1, "y": 2 }, { "x": 30, "y": 40 }, { "x": 50, "y": 6 }, 0]
        ];
        for (const [start, control, end, thickness] of cases) {
            expect(execute(start, control, end, thickness))
                .toStrictEqual(reference(start, control, end, thickness));
        }
    });

    it("does not keep state between calls", () =>
    {
        const a = execute({ "x": 0, "y": 0 }, { "x": 50, "y": 100 }, { "x": 100, "y": 0 }, 5);
        execute({ "x": 9, "y": 9 }, { "x": -70, "y": 3 }, { "x": 20, "y": -44 }, 11);
        const b = execute({ "x": 0, "y": 0 }, { "x": 50, "y": 100 }, { "x": 100, "y": 0 }, 5);
        expect(b).toStrictEqual(a);
        expect(b).not.toBe(a);
    });
});
