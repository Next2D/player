import { execute } from "./ShapeHitTestUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it, beforeEach } from "vitest";

describe("ShapeHitTestUseCase.js test", () =>
{
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() =>
    {
        canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        context = canvas.getContext("2d") as CanvasRenderingContext2D;
    });

    it("execute test case1 - returns false for zero width shape", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 10;
        shape.graphics.xMax = 10; // Same as xMin (width = 0)
        shape.graphics.yMax = 20;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 10, y: 10 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case2 - returns false for zero height shape", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 10;
        shape.graphics.xMax = 20;
        shape.graphics.yMax = 10; // Same as yMin (height = 0)
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 15, y: 10 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case3 - returns false for negative width", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 20;
        shape.graphics.yMin = 10;
        shape.graphics.xMax = 10; // xMax < xMin
        shape.graphics.yMax = 20;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 15, y: 15 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case4 - returns false for negative height", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 20;
        shape.graphics.xMax = 20;
        shape.graphics.yMax = 10; // yMax < yMin
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 15, y: 15 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case5 - uses identity matrix", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, identityMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case6 - uses translated matrix", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 50;
        
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const hitObject = { x: 125, y: 125 };
        
        const result = execute(shape, context, translatedMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case7 - uses scaled matrix", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 50;
        
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, scaledMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case8 - validates return type", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.yMin = 10;
        shape.graphics.xMax = 110;
        shape.graphics.yMax = 110;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
        expect([true, false]).toContain(result);
    });

    it("execute test case9 - handles different hit positions", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const hitObject1 = { x: 50, y: 50 };
        const result1 = execute(shape, context, matrix, hitObject1);
        expect(typeof result1).toBe("boolean");
        
        const hitObject2 = { x: 200, y: 200 };
        const result2 = execute(shape, context, matrix, hitObject2);
        expect(typeof result2).toBe("boolean");
    });

    it("execute test case10 - validates context usage", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        expect(context).toBeDefined();
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });
});
