import { describe, expect, it, vi } from "vitest";
import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";

vi.mock("../../WebGPUUtil", () => ({
    "$context": { "joints": 0, "caps": 0, "thickness": 1 }
}));

// OffscreenCanvas は点の内外判定にだけ使われる。このテストでは使わない
(globalThis as unknown as { OffscreenCanvas: unknown }).OffscreenCanvas ??= class {
    getContext (): object
    {
        return {};
    }
};

const { calculateCurveRectangle } = await import("./MeshStrokeGenerateUseCase");

/**
 * 点やセグメントごとにオブジェクトを作る素直な実装。
 * calculateCurveRectangle はこれと同じ値を、作業領域を使い回して計算する。
 */
const lerp = (p0: IPoint, p1: IPoint, t: number): IPoint => ({
    "x": p0.x + (p1.x - p0.x) * t,
    "y": p0.y + (p1.y - p0.y) * t
});

const normalize = (point: IPoint): IPoint =>
{
    const length = Math.sqrt(point.x * point.x + point.y * point.y);
    return length === 0
        ? { "x": 0, "y": 0 }
        : { "x": point.x / length, "y": point.y / length };
};

const offsetQuadratic = (s0: IPoint, s1: IPoint, s2: IPoint, offset: number): IPoint[] =>
{
    const points: IPoint[] = [];
    for (const t of [0, 0.5, 1]) {
        const pos = {
            "x": (1 - t) ** 2 * s0.x + 2 * (1 - t) * t * s1.x + t ** 2 * s2.x,
            "y": (1 - t) ** 2 * s0.y + 2 * (1 - t) * t * s1.y + t ** 2 * s2.y
        };
        const tan = {
            "x": 2 * (1 - t) * (s1.x - s0.x) + 2 * t * (s2.x - s1.x),
            "y": 2 * (1 - t) * (s1.y - s0.y) + 2 * t * (s2.y - s1.y)
        };
        const n = normalize({ "x": -tan.y, "y": tan.x });
        points.push({ "x": pos.x + n.x * offset, "y": pos.y + n.y * offset });
    }
    return points;
};

const reference = (start: IPoint, control: IPoint, end: IPoint, thickness: number): IPath =>
{
    let segments: Array<IPoint[]> = [[start, control, end]];
    for (let i = 0; i < 5; i++) {
        const next: Array<IPoint[]> = [];
        for (const seg of segments) {
            const m0 = lerp(seg[0], seg[1], 0.5);
            const m1 = lerp(seg[1], seg[2], 0.5);
            const m01 = lerp(m0, m1, 0.5);
            next.push([seg[0], m0, m01], [m01, m1, seg[2]]);
        }
        segments = next;
    }

    const leftCurves: Array<IPoint[]> = [];
    const rightCurves: Array<IPoint[]> = [];
    for (const seg of segments) {
        leftCurves.push(offsetQuadratic(seg[0], seg[1], seg[2], +thickness));
        rightCurves.push(offsetQuadratic(seg[0], seg[1], seg[2], -thickness));
    }

    // 各セグメントの終点を次のセグメントの始点に一致させる
    for (let idx = 0; idx < leftCurves.length - 1; ++idx) {
        leftCurves[idx + 1][0] = leftCurves[idx][2];
    }
    for (let idx = 0; idx < rightCurves.length - 1; ++idx) {
        rightCurves[idx + 1][0] = rightCurves[idx][2];
    }

    const paths: IPath = [leftCurves[0][0].x, leftCurves[0][0].y, false];
    for (const curves of leftCurves) {
        paths.push(curves[1].x, curves[1].y, true, curves[2].x, curves[2].y, false);
    }

    const reversed = [...rightCurves].reverse().map(([q0, q1, q2]) => [q2, q1, q0]);
    paths.push(reversed[0][0].x, reversed[0][0].y, false);
    for (const curves of reversed) {
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

describe("MeshStrokeGenerateUseCase.js calculateCurveRectangle test", () =>
{
    it("returns exactly the same outline as the straightforward implementation", () =>
    {
        const next = random(20261121);
        for (let count = 0; count < 300; ++count) {
            const start   = { "x": next() * 2000 - 1000, "y": next() * 2000 - 1000 };
            const control = { "x": next() * 2000 - 1000, "y": next() * 2000 - 1000 };
            const end     = { "x": next() * 2000 - 1000, "y": next() * 2000 - 1000 };
            const thickness = next() * 40;
            expect(calculateCurveRectangle(start, control, end, thickness))
                .toStrictEqual(reference(start, control, end, thickness));
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
            expect(calculateCurveRectangle(start, control, end, thickness))
                .toStrictEqual(reference(start, control, end, thickness));
        }
    });

    it("does not keep state between calls", () =>
    {
        const a = calculateCurveRectangle({ "x": 0, "y": 0 }, { "x": 50, "y": 100 }, { "x": 100, "y": 0 }, 5);
        calculateCurveRectangle({ "x": 9, "y": 9 }, { "x": -70, "y": 3 }, { "x": 20, "y": -44 }, 11);
        const b = calculateCurveRectangle({ "x": 0, "y": 0 }, { "x": 50, "y": 100 }, { "x": 100, "y": 0 }, 5);
        expect(b).toStrictEqual(a);
        expect(b).not.toBe(a);
    });
});
