import { execute } from "./ShapeCalcBoundsMatrixUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeCalcBoundsMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;
        const bounds = execute(shape, null);

        expect(bounds[0]).toBe(1);
        expect(bounds[1]).toBe(2);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("execute test case2", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;
        const bounds = execute(shape, new Float32Array([1.3, 0.5, 0.2, 1.2, 110, 220]));

        expect(bounds[0]).toBe(111.69999995827675);
        expect(bounds[1]).toBe(222.90000009536743);
        expect(bounds[2]).toBe(114.69999986886978);
        expect(bounds[3]).toBe(226.30000019073486);
    });
});