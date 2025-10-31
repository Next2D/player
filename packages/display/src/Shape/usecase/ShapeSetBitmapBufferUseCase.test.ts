import { execute } from "./ShapeSetBitmapBufferUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeSetBitmapBufferUseCase.js test", () =>
{
    it("execute test case1 - sets bitmap flag", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array([255, 0, 0, 255]);
        
        expect(shape.isBitmap).toBe(false);
        
        execute(shape, 1, 1, buffer);
        
        expect(shape.isBitmap).toBe(true);
    });

    it("execute test case2 - sets bitmap buffer", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255]);
        
        expect(shape.$bitmapBuffer).toBeNull();
        
        execute(shape, 2, 1, buffer);
        
        expect(shape.$bitmapBuffer).toBe(buffer);
    });

    it("execute test case3 - sets graphics bounds", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array(400); // 10x10 RGBA
        
        execute(shape, 10, 10, buffer);
        
        expect(shape.graphics.xMin).toBe(0);
        expect(shape.graphics.yMin).toBe(0);
        expect(shape.graphics.xMax).toBe(10);
        expect(shape.graphics.yMax).toBe(10);
    });

    it("execute test case4 - handles small buffer", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array([255, 255, 255, 255]);
        
        execute(shape, 1, 1, buffer);
        
        expect(shape.isBitmap).toBe(true);
        expect(shape.$bitmapBuffer).toBe(buffer);
        expect(shape.graphics.xMax).toBe(1);
        expect(shape.graphics.yMax).toBe(1);
    });

    it("execute test case5 - handles large buffer", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array(1920 * 1080 * 4);
        
        execute(shape, 1920, 1080, buffer);
        
        expect(shape.isBitmap).toBe(true);
        expect(shape.$bitmapBuffer).toBe(buffer);
        expect(shape.graphics.xMax).toBe(1920);
        expect(shape.graphics.yMax).toBe(1080);
    });

    it("execute test case6 - clears previous bitmap", () =>
    {
        const shape = new Shape();
        const buffer1 = new Uint8Array([255, 0, 0, 255]);
        const buffer2 = new Uint8Array([0, 255, 0, 255]);
        
        execute(shape, 1, 1, buffer1);
        expect(shape.$bitmapBuffer).toBe(buffer1);
        
        execute(shape, 1, 1, buffer2);
        expect(shape.$bitmapBuffer).toBe(buffer2);
    });

    it("execute test case7 - handles different dimensions", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array(800); // 20x10 RGBA
        
        execute(shape, 20, 10, buffer);
        
        expect(shape.graphics.xMax).toBe(20);
        expect(shape.graphics.yMax).toBe(10);
    });

    it("execute test case8 - handles square dimensions", () =>
    {
        const shape = new Shape();
        const buffer = new Uint8Array(10000); // 50x50 RGBA
        
        execute(shape, 50, 50, buffer);
        
        expect(shape.graphics.xMax).toBe(50);
        expect(shape.graphics.yMax).toBe(50);
    });

    it("execute test case9 - updates bounds origin", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 100;
        shape.graphics.yMin = 200;
        
        const buffer = new Uint8Array(400);
        execute(shape, 10, 10, buffer);
        
        expect(shape.graphics.xMin).toBe(0);
        expect(shape.graphics.yMin).toBe(0);
    });

    it("execute test case10 - preserves shape instance", () =>
    {
        const shape = new Shape();
        const originalShape = shape;
        const buffer = new Uint8Array(1600); // 20x20 RGBA
        
        execute(shape, 20, 20, buffer);
        
        expect(shape).toBe(originalShape);
        expect(shape.isBitmap).toBe(true);
    });
});
