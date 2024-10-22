import { execute } from "./DisplayObjectGetRawMatrixUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectGetRawMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        const matrix = execute(displayObject);
        expect(matrix).toBeNull();
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix(10, 20, 30, 40, 50, 60);
        const matrix = execute(displayObject);
        if (!matrix) {
            throw new Error("matrix is null");
        }

        expect(matrix[0]).toBe(10);
        expect(matrix[1]).toBe(20);
        expect(matrix[2]).toBe(30);
        expect(matrix[3]).toBe(40);
        expect(matrix[4]).toBe(50);
        expect(matrix[5]).toBe(60);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            matrix: [1, 2, 3, 4, 5, 6]
        };

        const matrix = execute(displayObject);
        if (!matrix) {
            throw new Error("matrix is null");
        }

        expect(matrix[0]).toBe(1);
        expect(matrix[1]).toBe(2);
        expect(matrix[2]).toBe(3);
        expect(matrix[3]).toBe(4);
        expect(matrix[4]).toBe(5);
        expect(matrix[5]).toBe(6);
    });
});