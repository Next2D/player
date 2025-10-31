import { execute } from "./DisplayObjectGetMatrixUseCase";
import { DisplayObject } from "../../DisplayObject";
import { Matrix } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetMatrixUseCase.js test", () =>
{
    it("execute test case1 - default Matrix", () =>
    {
        const displayObject = new DisplayObject();
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Matrix);
        expect(result.a).toBe(1);
        expect(result.b).toBe(0);
        expect(result.c).toBe(0);
        expect(result.d).toBe(1);
        expect(result.tx).toBe(0);
        expect(result.ty).toBe(0);
    });

    it("execute test case2 - custom Matrix", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix(2, 0, 0, 2, 100, 50);
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Matrix);
        expect(result.a).toBe(2);
        expect(result.d).toBe(2);
        expect(result.tx).toBe(100);
        expect(result.ty).toBe(50);
    });

    it("execute test case3 - Matrix from placeObject", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            matrix: [1.5, 0, 0, 1.5, 200, 100],
            typedMatrix: new Float32Array([1.5, 0, 0, 1.5, 200, 100])
        };
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Matrix);
        expect(result.a).toBe(1.5);
        expect(result.d).toBe(1.5);
        expect(result.tx).toBe(200);
        expect(result.ty).toBe(100);
    });

    it("execute test case4 - rotated Matrix", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$rotation = Math.PI / 4; // 45 degrees
        displayObject.$matrix = new Matrix(
            Math.cos(Math.PI / 4), 
            Math.sin(Math.PI / 4), 
            -Math.sin(Math.PI / 4), 
            Math.cos(Math.PI / 4), 
            0, 
            0
        );
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Matrix);
        expect(result.a).toBeCloseTo(Math.cos(Math.PI / 4), 5);
        expect(result.b).toBeCloseTo(Math.sin(Math.PI / 4), 5);
    });

    it("execute test case5 - transformed Matrix", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix(1, 0, 0, 1, 50, 75);
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Matrix);
        expect(result.tx).toBe(50);
        expect(result.ty).toBe(75);
    });

    it("execute test case6 - null Matrix returns identity", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = null;
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(Matrix);
        expect(result.a).toBe(1);
        expect(result.b).toBe(0);
        expect(result.c).toBe(0);
        expect(result.d).toBe(1);
        expect(result.tx).toBe(0);
        expect(result.ty).toBe(0);
    });
});
