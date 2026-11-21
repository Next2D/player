import { execute } from "./PathCommandBezierCurveToUseCase";
import { afterEach, describe, expect, it } from "vitest";
import { execute as adaptiveCubicToQuad } from "../../BezierConverter/usecase/BezierConverterAdaptiveCubicToQuadUseCase";
import { $context, $setContext } from "../../WebGLUtil";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandBezierCurveToUseCase.js method test", () =>
{
    it("test case - flat curve uses minimal segments", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;

        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);

        // 直線的なベジエ曲線（フラット）: 適応的テッセレーションで最小2セグメント
        // Flat bezier curve: adaptive tessellation uses minimum 2 segments
        execute(10, 10, 20, 20, 30, 30);

        // 適応的テッセレーション: フラットな曲線は2セグメント = 15要素
        // Adaptive tessellation: flat curves use 2 segments = 15 elements
        // (moveTo: 3) + (2 quadratics: 2 * 6) = 3 + 12 = 15
        expect($currentPath.length).toBe(15);
        expect($vertices.length).toBe(0);

        // 始点
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);

        // 最終点が正しいことを確認
        expect($currentPath[$currentPath.length - 3]).toBe(30);
        expect($currentPath[$currentPath.length - 2]).toBe(30);
        expect($currentPath[$currentPath.length - 1]).toBe(false);
    });

    it("test case - curved path uses more segments", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;

        // 曲率のあるベジエ曲線: より多くのセグメントが必要
        // Curved bezier: requires more segments
        execute(0, 100, 100, 0, 100, 100);

        // 曲率が高いので4セグメント以上 = 27要素以上
        // Higher curvature requires 4+ segments = 27+ elements
        expect($currentPath.length).toBeGreaterThanOrEqual(27);
        expect($vertices.length).toBe(0);

        // 始点
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);

        // 最終点
        expect($currentPath[$currentPath.length - 3]).toBe(100);
        expect($currentPath[$currentPath.length - 2]).toBe(100);
        expect($currentPath[$currentPath.length - 1]).toBe(false);
    });

    describe("with a drawing context (on-screen scale known)", () =>
    {
        const original = $context;
        afterEach(() =>
        {
            $setContext(original);
        });

        const setScale = (scale: number): void =>
        {
            $setContext({
                "$matrix": new Float32Array([scale, 0, 0, 0, scale, 0, 0, 0, 1])
            } as any);
        };

        // 経路を、作業用バッファを通る汎用の変換だけで組み立てた場合の結果
        const expected = (curves: number[][], scale: number): number[] =>
        {
            const path: any[] = [0, 0, false];
            for (const curve of curves) {
                const fromX = +path[path.length - 3];
                const fromY = +path[path.length - 2];
                if (curve[4] === fromX && curve[5] === fromY) {
                    continue;
                }
                const result = adaptiveCubicToQuad(
                    fromX, fromY, curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], scale
                );
                const values = Array.from(result.buffer.subarray(0, result.count * 4));
                for (let idx = 0; idx < values.length; idx += 4) {
                    path.push(values[idx], values[idx + 1], true, values[idx + 2], values[idx + 3], false);
                }
            }
            return path;
        };

        const curves: number[][] = [
            [0.5, 0.25, 1.5, 0.75, 2, 2],          // 小さい: 1 本
            [2.4, 2.6, 2.9, 3.1, 3.5, 3.25],       // 小さい: 1 本
            [60, 3.25, 3.5, 60, 60, 60],           // 大きく曲がる: 複数本
            [61, 61, 62, 61.5, 63, 62.5],          // 小さい: 1 本
            [63, 62.5, 63, 62.5, 63, 62.5]         // 終点が現在の点と同じ: 何もしない
        ];

        for (const scale of [0.5, 1, 2.5]) {
            it(`matches the general conversion at scale ${scale}`, () =>
            {
                $currentPath.length = 0;
                $vertices.length = 0;
                setScale(scale);

                for (const curve of curves) {
                    execute(curve[0], curve[1], curve[2], curve[3], curve[4], curve[5]);
                }

                const want = expected(curves, scale);
                expect($currentPath.length).toBe(want.length);
                for (let idx = 0; idx < want.length; ++idx) {
                    if (typeof want[idx] === "number") {
                        // 汎用の変換は単精度のバッファを通るので、その丸めの分だけ許す
                        expect($currentPath[idx] as number).toBeCloseTo(want[idx], 4);
                    } else {
                        expect($currentPath[idx]).toBe(want[idx]);
                    }
                }
            });
        }

        it("a small curve becomes a single quadratic curve", () =>
        {
            $currentPath.length = 0;
            $vertices.length = 0;
            setScale(0.5);

            execute(0.5, 0.25, 1.5, 0.75, 2, 2);

            // moveTo(0, 0) + 制御点 + 終点
            expect($currentPath.length).toBe(9);
            expect($currentPath[3]).toBeCloseTo((3 * 0.5 + 3 * 1.5 - 0 - 2) * 0.25, 10);
            expect($currentPath[4]).toBeCloseTo((3 * 0.25 + 3 * 0.75 - 0 - 2) * 0.25, 10);
            expect($currentPath[5]).toBe(true);
            expect($currentPath[6]).toBe(2);
            expect($currentPath[7]).toBe(2);
            expect($currentPath[8]).toBe(false);
        });
    });
});
