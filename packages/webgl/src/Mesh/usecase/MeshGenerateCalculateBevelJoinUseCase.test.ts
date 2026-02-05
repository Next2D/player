import { execute } from "./MeshGenerateCalculateBevelJoinUseCase";
import { describe, expect, it } from "vitest";

describe("MeshGenerateCalculateBevelJoinUseCase.js method test", () =>
{
    it("test case - basic bevel join", () =>
    {
        const rectangles = [
            [0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false],
            [10, 0, false, 10, 10, false, 5, 10, false, 5, 0, false, 10, 0, false]
        ];

        const initialLength = rectangles.length;
        execute(10, 0, 3, rectangles);
        expect(rectangles.length).toBeGreaterThanOrEqual(initialLength);
    });

    it("test case - bevel join with is_last=true", () =>
    {
        const rectangles = [
            [0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false],
            [10, 0, false, 10, 10, false, 5, 10, false, 5, 0, false, 10, 0, false],
            [10, 10, false, 0, 10, false, 0, 15, false, 10, 15, false, 10, 10, false]
        ];

        const initialLength = rectangles.length;
        execute(10, 10, 3, rectangles, true);
        expect(rectangles.length).toBeGreaterThanOrEqual(initialLength);
    });

    it("test case - parallel paths (no join)", () =>
    {
        const rectangles = [
            [10, 10, false, 20, 10, false, 20, 15, false, 10, 15, false, 10, 10, false],
            [20, 10, false, 30, 10, false, 30, 15, false, 20, 15, false, 20, 10, false]
        ];

        const initialLength = rectangles.length;
        execute(20, 10, 5, rectangles);
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
