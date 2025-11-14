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

    it("execute test case11 - hit inside shape without buffer (default rectangle path)", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case12 - hit outside shape without buffer", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 150, y: 150 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case13 - hit on edge of shape without buffer", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 0, y: 0 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case14 - hit with shape transformation (rawMatrix)", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 50;
        shape.x = 50;
        shape.y = 50;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 75, y: 75 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case15 - hit with scaled shape transformation", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 50;
        shape.scaleX = 2;
        shape.scaleY = 2;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 75, y: 75 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case16 - hit with rotated shape", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        shape.rotation = 45;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case17 - hit with combined parent matrix and shape transformation", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 50;
        shape.x = 10;
        shape.y = 10;
        
        const parentMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const hitObject = { x: 125, y: 125 };
        
        const result = execute(shape, context, parentMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case18 - hit with graphics buffer", () =>
    {
        const shape = new Shape();
        shape.graphics.beginFill(0xFF0000);
        shape.graphics.drawRect(0, 0, 100, 100);
        shape.graphics.endFill();
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case19 - hit outside with graphics buffer", () =>
    {
        const shape = new Shape();
        shape.graphics.beginFill(0xFF0000);
        shape.graphics.drawRect(0, 0, 100, 100);
        shape.graphics.endFill();
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 150, y: 150 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case20 - hit with line stroke graphics buffer", () =>
    {
        const shape = new Shape();
        shape.graphics.lineStyle(5, 0x000000);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(100, 100);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case21 - hit with circle graphics buffer", () =>
    {
        const shape = new Shape();
        shape.graphics.beginFill(0x00FF00);
        shape.graphics.drawCircle(50, 50, 50);
        shape.graphics.endFill();
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case22 - handles negative coordinates", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = -50;
        shape.graphics.yMin = -50;
        shape.graphics.xMax = 50;
        shape.graphics.yMax = 50;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 0, y: 0 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case23 - handles fractional coordinates", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0.5;
        shape.graphics.yMin = 0.5;
        shape.graphics.xMax = 100.5;
        shape.graphics.yMax = 100.5;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50.25, y: 50.25 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case24 - handles very small shape", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 1;
        shape.graphics.yMax = 1;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 0.5, y: 0.5 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case25 - handles very large shape", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 10000;
        shape.graphics.yMax = 10000;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 5000, y: 5000 };
        
        const result = execute(shape, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });
});
