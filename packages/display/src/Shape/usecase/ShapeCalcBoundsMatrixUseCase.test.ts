import { execute } from "./ShapeCalcBoundsMatrixUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("ShapeCalcBoundsMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        const bounds = execute(shape);
        expect(bounds[0]).toBe(1);
        expect(bounds[1]).toBe(2);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("execute test case2", () =>
    {
        const shape = new Shape();
        shape.$matrix = new Matrix(1.3, 0.5, 0.2, 1.2, 110, 220);
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;
        
        const bounds = execute(shape);
        expect(bounds[0]).toBe(111.69999694824219);
        expect(bounds[1]).toBe(222.89999389648438);
        expect(bounds[2]).toBe(114.69999694824219);
        expect(bounds[3]).toBe(226.3000030517578);
    });

    it("execute test case3", () =>
    {
        const shape = new Shape();
        shape.$matrix = new Matrix(0.9, 0.25, -0.2, 1.5, 10, 20);
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;

        const bounds = execute(shape, new Float32Array([1.3, 0.5, 0.2, 1.2, 110, 220]));
        expect(bounds[0]).toBe(128.3000030517578);
        expect(bounds[1]).toBe(253.14999389648438);
        expect(bounds[2]).toBe(130.82000732421875);
        expect(bounds[3]).toBe(258.04998779296875);
    });
});