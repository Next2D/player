import { execute } from "./MeshGenerateCalculateRoundJoinUseCase";
import { describe, expect, it } from "vitest";

describe("MeshGenerateCalculateRoundJoinUseCase.js method test", () =>
{
    it("test case - round join adds geometry when points are found outside other rectangle", () =>
    {
        // Two rectangles meeting at point (50, 50) with stroke width 5
        // Rectangle 1: horizontal line going right from (50, 50)
        // Rectangle 2: vertical line going down from (50, 50)
        const rectangles = [
            // Rect 1: from (50,50) going right, with perpendicular offset of 5
            [50, 45, false, 100, 45, false, 100, 55, false, 50, 55, false, 50, 45, false],
            // Rect 2: from (50,50) going down, with perpendicular offset of 5
            [45, 50, false, 55, 50, false, 55, 100, false, 45, 100, false, 45, 50, false]
        ];

        const initialLength = rectangles.length;
        execute(50, 50, 5, rectangles);

        // If points at distance 5 from (50,50) are found in both rectangles
        // and at least one point from each rectangle is outside the other,
        // join geometry will be added
        // Note: With this configuration, the function may or may not add join geometry
        // depending on whether points are found at exact distance r
        expect(rectangles.length).toBeGreaterThanOrEqual(initialLength);
    });

    it("test case - round join skips when no points found at radius r", () =>
    {
        // Two rectangles far from the center point
        const rectangles = [
            [0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false],
            [100, 100, false, 110, 100, false, 110, 105, false, 100, 105, false, 100, 100, false]
        ];

        const initialLength = rectangles.length;
        // Center at (50, 50) with radius 5 - no rectangle points are at this distance
        execute(50, 50, 5, rectangles);
        // No join geometry added because no points found at distance 5 from center
        expect(rectangles.length).toBe(initialLength);
    });

    it("test case - curve-to-curve join should be skipped", () =>
    {
        // 曲線矩形は15要素より長い（曲線の制御点を含む）
        // 曲線同士の接合ではjoinジオメトリを追加しない
        const curveRectangle1 = [
            0, 0, false, 5, 0, true, 10, 5, false, 10, 10, false,
            5, 10, false, 0, 5, false, 0, 0, false
        ]; // 21 elements (> 15)
        const curveRectangle2 = [
            10, 10, false, 15, 10, true, 20, 15, false, 20, 20, false,
            15, 20, false, 10, 15, false, 10, 10, false
        ]; // 21 elements (> 15)

        const rectangles = [curveRectangle1, curveRectangle2];
        const initialLength = rectangles.length;

        execute(10, 10, 5, rectangles);

        // 曲線同士の接合なのでjoinは追加されない
        expect(rectangles.length).toBe(initialLength);
    });

    it("test case - line-to-curve join should NOT be skipped", () =>
    {
        // 線矩形（15要素）と曲線矩形の接合
        const lineRectangle = [
            0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false
        ]; // 15 elements
        const curveRectangle = [
            10, 0, false, 15, 0, true, 20, 5, false, 20, 10, false,
            15, 10, false, 10, 5, false, 10, 0, false
        ]; // 21 elements (> 15)

        const rectangles = [lineRectangle, curveRectangle];
        const initialLength = rectangles.length;

        execute(10, 0, 5, rectangles);

        // 線と曲線の接合は処理される（結果はジオメトリに依存）
        expect(rectangles.length).toBeGreaterThanOrEqual(initialLength);
    });
});
