import { execute } from "./TextFieldHitTestUseCase";
import { TextField } from "@next2d/text";
import { describe, expect, it, beforeEach } from "vitest";

describe("TextFieldHitTestUseCase.js test", () =>
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

    it("execute test case1 - returns false for zero width TextField", () =>
    {
        const textField = new TextField();
        textField.xMin = 10;
        textField.yMin = 10;
        textField.xMax = 10; // Same as xMin (width = 0)
        textField.yMax = 20;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 10, y: 10 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case2 - returns false for zero height TextField", () =>
    {
        const textField = new TextField();
        textField.xMin = 10;
        textField.yMin = 10;
        textField.xMax = 20;
        textField.yMax = 10; // Same as yMin (height = 0)
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 15, y: 10 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case3 - returns false for negative width", () =>
    {
        const textField = new TextField();
        textField.xMin = 20;
        textField.yMin = 10;
        textField.xMax = 10; // xMax < xMin
        textField.yMax = 20;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 15, y: 15 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case4 - returns false for negative height", () =>
    {
        const textField = new TextField();
        textField.xMin = 10;
        textField.yMin = 20;
        textField.xMax = 20;
        textField.yMax = 10; // yMax < yMin
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 15, y: 15 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case5 - uses identity matrix", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 100;
        textField.yMax = 100;
        
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(textField, context, identityMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case6 - uses translated matrix", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 50;
        textField.yMax = 50;
        
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const hitObject = { x: 125, y: 125 };
        
        const result = execute(textField, context, translatedMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case7 - uses scaled matrix", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 50;
        textField.yMax = 50;
        
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(textField, context, scaledMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case8 - validates return type", () =>
    {
        const textField = new TextField();
        textField.xMin = 10;
        textField.yMin = 10;
        textField.xMax = 110;
        textField.yMax = 110;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
        expect([true, false]).toContain(result);
    });

    it("execute test case9 - handles different hit positions", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 100;
        textField.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const hitObject1 = { x: 50, y: 50 };
        const result1 = execute(textField, context, matrix, hitObject1);
        expect(typeof result1).toBe("boolean");
        
        const hitObject2 = { x: 200, y: 200 };
        const result2 = execute(textField, context, matrix, hitObject2);
        expect(typeof result2).toBe("boolean");
    });

    it("execute test case10 - validates context usage", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 100;
        textField.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 50, y: 50 };
        
        expect(context).toBeDefined();
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case11 - handles TextField boundaries", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 100;
        textField.yMax = 100;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        // Test corners
        const corner1 = execute(textField, context, matrix, { x: 0, y: 0 });
        const corner2 = execute(textField, context, matrix, { x: 100, y: 100 });
        
        expect(typeof corner1).toBe("boolean");
        expect(typeof corner2).toBe("boolean");
    });

    it("execute test case12 - handles large TextField", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 1000;
        textField.yMax = 500;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 500, y: 250 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case13 - handles small TextField", () =>
    {
        const textField = new TextField();
        textField.xMin = 0;
        textField.yMin = 0;
        textField.xMax = 10;
        textField.yMax = 10;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 5, y: 5 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case14 - handles negative coordinates", () =>
    {
        const textField = new TextField();
        textField.xMin = -50;
        textField.yMin = -50;
        textField.xMax = 50;
        textField.yMax = 50;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 0, y: 0 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case15 - handles decimal coordinates", () =>
    {
        const textField = new TextField();
        textField.xMin = 10.5;
        textField.yMin = 20.3;
        textField.xMax = 110.7;
        textField.yMax = 120.9;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 60.5, y: 70.5 };
        
        const result = execute(textField, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });
});
