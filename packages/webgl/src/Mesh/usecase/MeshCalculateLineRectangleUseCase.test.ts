import { execute } from "./MeshCalculateLineRectangleUseCase";
import { describe, expect, it } from "vitest";

describe("MeshCalculateLineRectangleUseCase.js method test", () =>
{
    it("test case", () =>
    {
        expect(execute({ x: 120, y: 90 }, { x: -231, y: 110 }, 3)).toEqual([
            119.82933665318774, 87.00485826344482, false,
            -231.17066334681226, 107.00485826344482,false,
            -230.82933665318774, 112.99514173655518, false,
            120.17066334681226, 92.99514173655518, false,
            119.82933665318774, 87.00485826344482, false
        ]);
    });
});