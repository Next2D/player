import { execute } from "./DisplayObjectGetColorTransformUseCase";
import { DisplayObject } from "../../DisplayObject";
import { ColorTransform } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetColorTransformUseCase.js test", () =>
{
    it("execute test case1 - default ColorTransform", () =>
    {
        const displayObject = new DisplayObject();
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(ColorTransform);
        expect(result.redMultiplier).toBe(1);
        expect(result.greenMultiplier).toBe(1);
        expect(result.blueMultiplier).toBe(1);
        expect(result.alphaMultiplier).toBe(1);
        expect(result.redOffset).toBe(0);
        expect(result.greenOffset).toBe(0);
        expect(result.blueOffset).toBe(0);
        expect(result.alphaOffset).toBe(0);
    });

    it("execute test case2 - custom ColorTransform", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$colorTransform = new ColorTransform(0.5, 0.6, 0.7, 0.8, 10, 20, 30, 40);
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(ColorTransform);
        expect(result.redMultiplier).toBeCloseTo(0.5, 1);
        expect(result.greenMultiplier).toBeCloseTo(0.6, 1);
        expect(result.blueMultiplier).toBeCloseTo(0.7, 1);
        expect(result.alphaMultiplier).toBeCloseTo(0.8, 1);
    });

    it("execute test case3 - ColorTransform from placeObject", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            colorTransform: [0.9, 0.8, 0.7, 0.6, 5, 10, 15, 20],
            typedColorTransform: new Float32Array([0.9, 0.8, 0.7, 0.6, 5, 10, 15, 20])
        };
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(ColorTransform);
        expect(result.alphaMultiplier).toBeCloseTo(0.6, 1);
    });

    it("execute test case4 - alpha only", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$colorTransform = new ColorTransform(1, 1, 1, 0.5, 0, 0, 0, 0);
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(ColorTransform);
        expect(result.alphaMultiplier).toBeCloseTo(0.5, 1);
    });

    it("execute test case5 - identity ColorTransform", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$colorTransform = null;
        displayObject.$alpha = 1;
        
        const result = execute(displayObject);
        
        expect(result).toBeInstanceOf(ColorTransform);
        expect(result.redMultiplier).toBe(1);
        expect(result.alphaMultiplier).toBe(1);
    });
});
