import { execute } from "./PathCommandBezierCurveToUseCase";
import { describe, expect, it } from "vitest";
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
});