import { execute } from "./MeshGenerateCalculateRoundJoinUseCase";
import { describe, expect, it } from "vitest";

describe("MeshGenerateCalculateRoundJoinUseCase.js method test", () =>
{
    it("test case - basic round join returns without error when points not inside", () =>
    {
        const rectangles = [
            [0, 0, false, 10, 0, false, 10, 5, false, 0, 5, false, 0, 0, false],
            [100, 100, false, 110, 100, false, 110, 105, false, 100, 105, false, 100, 100, false]
        ];

        const initialLength = rectangles.length;
        execute(50, 50, 5, rectangles);
        expect(rectangles.length).toBe(initialLength);
    });
});
