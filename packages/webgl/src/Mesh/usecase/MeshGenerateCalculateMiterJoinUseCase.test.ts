import { execute } from "./MeshGenerateCalculateMiterJoinUseCase";
import { describe, expect, it } from "vitest";

describe("MeshGenerateCalculateMiterJoinUseCase.js method test", () =>
{
    it("test case - basic miter join", () =>
    {
        const rectangles = [
            [0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false],
            [10, 0, false, 10, 10, false, 5, 10, false, 5, 0, false, 10, 0, false]
        ];

        const startPoint = { x: 10, y: 0 };
        const endPoint = { x: 10, y: 10 };
        const prevPoint = { x: 0, y: 0 };

        const initialLength = rectangles.length;
        execute(startPoint, endPoint, prevPoint, 3, rectangles);
        expect(rectangles.length).toBeGreaterThanOrEqual(initialLength);
    });

    it("test case - miter join with is_last=true", () =>
    {
        const rectangles = [
            [0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false],
            [10, 0, false, 10, 10, false, 5, 10, false, 5, 0, false, 10, 0, false],
            [10, 10, false, 0, 10, false, 0, 15, false, 10, 15, false, 10, 10, false]
        ];

        const startPoint = { x: 10, y: 10 };
        const endPoint = { x: 0, y: 10 };
        const prevPoint = { x: 10, y: 0 };

        const initialLength = rectangles.length;
        execute(startPoint, endPoint, prevPoint, 3, rectangles, true);
        expect(rectangles.length).toBeGreaterThanOrEqual(initialLength);
    });

    it("test case - parallel paths (no join)", () =>
    {
        const rectangles = [
            [10, 10, false, 20, 10, false, 20, 15, false, 10, 15, false, 10, 10, false],
            [20, 10, false, 30, 10, false, 30, 15, false, 20, 15, false, 20, 10, false]
        ];

        const startPoint = { x: 20, y: 10 };
        const endPoint = { x: 30, y: 10 };
        const prevPoint = { x: 10, y: 10 };

        const initialLength = rectangles.length;
        execute(startPoint, endPoint, prevPoint, 5, rectangles);
        expect(rectangles.length).toBe(initialLength);
    });
});
