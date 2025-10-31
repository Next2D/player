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
});
