import { execute } from "./DisplayObjectConcatenatedMatrixUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectConcatenatedMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();

        const matrix = execute(displayObject);
        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix(1, 2, 3, 4, 5, 6);

        const matrix = execute(displayObject);
        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(2);
        expect(matrix.c).toBe(3);
        expect(matrix.d).toBe(4);
        expect(matrix.tx).toBe(5);
        expect(matrix.ty).toBe(6);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix(1, 2, 3, 4, 5, 6);

        const parent = new DisplayObject();
        displayObject.parent = parent;
        parent.$matrix = new Matrix(2, 1.12, 1.3, 3, 120, 600);

        const matrix = execute(displayObject);
        expect(matrix.a).toBe(4.599999904632568);
        expect(matrix.b).toBe(7.119999885559082);
        expect(matrix.c).toBe(11.199999809265137);
        expect(matrix.d).toBe(15.359999656677246);
        expect(matrix.tx).toBe(137.8000030517578);
        expect(matrix.ty).toBe(623.5999755859375);
    });
    
});