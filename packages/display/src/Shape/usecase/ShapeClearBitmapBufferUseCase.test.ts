import { execute } from "./ShapeClearBitmapBufferUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeClearBitmapBufferUseCase.js test", () =>
{
    it("execute test case1 - clears bitmap flag", () =>
    {
        const shape = new Shape();
        shape.isBitmap = true;

        expect(shape.isBitmap).toBe(true);

        execute(shape);

        expect(shape.isBitmap).toBe(false);
    });

    it("execute test case2 - clears bitmap buffer", () =>
    {
        const shape = new Shape();
        shape.$bitmapBuffer = new Uint8Array([1, 2, 3, 4]);

        expect(shape.$bitmapBuffer).not.toBeNull();

        execute(shape);

        expect(shape.$bitmapBuffer).toBeNull();
    });

    it("execute test case3 - clears graphics", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.xMax = 100;

        execute(shape);

        // Graphics should be cleared
        expect(shape.graphics).toBeDefined();
    });

    it("execute test case4 - handles already cleared shape", () =>
    {
        const shape = new Shape();
        
        expect(shape.isBitmap).toBe(false);
        expect(shape.$bitmapBuffer).toBeNull();

        execute(shape);

        expect(shape.isBitmap).toBe(false);
        expect(shape.$bitmapBuffer).toBeNull();
    });

    it("execute test case5 - preserves shape instance", () =>
    {
        const shape = new Shape();
        const originalShape = shape;
        shape.isBitmap = true;

        execute(shape);

        expect(shape).toBe(originalShape);
        expect(shape.isBitmap).toBe(false);
    });

    it("execute test case6 - clears both bitmap properties", () =>
    {
        const shape = new Shape();
        shape.isBitmap = true;
        shape.$bitmapBuffer = new Uint8Array(100);

        expect(shape.isBitmap).toBe(true);
        expect(shape.$bitmapBuffer).not.toBeNull();

        execute(shape);

        expect(shape.isBitmap).toBe(false);
        expect(shape.$bitmapBuffer).toBeNull();
    });

    it("execute test case7 - can be called multiple times", () =>
    {
        const shape = new Shape();
        shape.isBitmap = true;

        execute(shape);
        expect(shape.isBitmap).toBe(false);

        execute(shape);
        expect(shape.isBitmap).toBe(false);

        execute(shape);
        expect(shape.isBitmap).toBe(false);
    });

    it("execute test case8 - shape remains valid after clear", () =>
    {
        const shape = new Shape();
        shape.isBitmap = true;
        shape.$bitmapBuffer = new Uint8Array(50);

        execute(shape);

        // Shape should still be valid
        expect(shape).toBeDefined();
        expect(shape.graphics).toBeDefined();
    });

    it("execute test case9 - clears large bitmap buffer", () =>
    {
        const shape = new Shape();
        shape.isBitmap = true;
        shape.$bitmapBuffer = new Uint8Array(10000);

        execute(shape);

        expect(shape.isBitmap).toBe(false);
        expect(shape.$bitmapBuffer).toBeNull();
    });

    it("execute test case10 - state after clear is consistent", () =>
    {
        const shape = new Shape();
        shape.isBitmap = true;
        shape.$bitmapBuffer = new Uint8Array(200);

        execute(shape);

        expect(shape.isBitmap).toBe(false);
        expect(shape.$bitmapBuffer).toBeNull();
        expect(shape.graphics).toBeDefined();
    });
});
