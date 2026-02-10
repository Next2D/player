import { execute } from "./PathCommandArcUseCase";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandArcUseCase.js method test", () =>
{
    it("test case - arc generates path with adaptive tessellation", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;

        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);

        // execute(cx, cy, radius) - 円を描画
        // Arc at center (10,10) with radius 20
        // 4つのベジエ曲線で完全な円を描画:
        // 1. (x+r, y) → (x, y+r) 右から上
        // 2. (x, y+r) → (x-r, y) 上から左
        // 3. (x-r, y) → (x, y-r) 左から下
        // 4. (x, y-r) → (x+r, y) 下から右
        // 最終点は開始点と同じ (cx+r, cy) = (30, 10)
        execute(10, 10, 20);

        // 適応的テッセレーションにより、セグメント数は曲率に応じて変化
        // Adaptive tessellation varies segment count based on curvature
        // 円弧は曲率が高いため、多くのセグメントが生成される
        expect($currentPath.length).toBeGreaterThan(0);
        expect($vertices.length).toBe(0);

        // 始点の確認 (moveTo(0,0) がない場合、自動的に (0,0) から開始)
        // Start point verification (auto-starts from (0,0) if no moveTo)
        expect($currentPath[0]).toBe(0);
        expect($currentPath[1]).toBe(0);
        expect($currentPath[2]).toBe(false);

        // 終点の確認（円の右端に戻る: cx + radius, cy = 30, 10）
        // End point verification (returns to right edge: cx + radius, cy = 30, 10)
        const lastX = $currentPath[$currentPath.length - 3];
        const lastY = $currentPath[$currentPath.length - 2];
        const lastFlag = $currentPath[$currentPath.length - 1];

        expect(lastX).toBe(30); // cx + radius = 10 + 20
        expect(lastY).toBe(10); // cy
        expect(lastFlag).toBe(false);
    });

    it("test case - full circle arc", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;

        // 小さい円は曲率が高いので、より多くのセグメントが必要
        // Small circle has higher curvature, requiring more segments
        execute(50, 50, 10);

        // パスが生成されたことを確認
        expect($currentPath.length).toBeGreaterThan(0);

        // 最終点が円の右端に戻ることを確認 (cx + radius, cy)
        const lastX = $currentPath[$currentPath.length - 3];
        const lastY = $currentPath[$currentPath.length - 2];

        // lastX should be 60 (cx + radius = 50 + 10)
        // lastY should be 50 (cy)
        expect(lastX).toBe(60);
        expect(lastY).toBe(50);
    });
});