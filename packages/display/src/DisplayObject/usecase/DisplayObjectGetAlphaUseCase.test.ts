import { execute } from "./DisplayObjectGetAlphaUseCase";
import { DisplayObject } from "../../DisplayObject";
import { ColorTransform } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetAlphaUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        expect(execute(displayObject)).toBe(1);
    });
    
    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$alpha = 0.5;
        expect(execute(displayObject)).toBe(0.5);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$colorTransform = new ColorTransform(1, 1, 1, 0.2, 0, 0, 0, 0);
        expect(execute(displayObject)).toBe(0.20000000298023224);
    });

    it("execute test case4", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = { 
            colorTransform: [1, 1, 1, 0.6, 0, 0, 0, 0],
            typedColorTransform: new Float32Array([1, 1, 1, 0.6, 0, 0, 0, 0]) 
        };
        expect(execute(displayObject)).toBe(0.6000000238418579);
    });
});