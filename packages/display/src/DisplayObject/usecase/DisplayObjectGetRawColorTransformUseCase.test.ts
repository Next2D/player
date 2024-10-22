import { execute } from "./DisplayObjectGetRawColorTransformUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { ColorTransform } from "@next2d/geom";

describe("DisplayObjectGetRawColorTransformUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        const colorTransform = execute(displayObject);
        expect(colorTransform).toBeNull();
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$colorTransform = new ColorTransform(8, 7, 6, 5, 4, 3, 2, 1);
        const colorTransform = execute(displayObject);
        if (!colorTransform) {
            throw new Error("colorTransform is null");
        }

        expect(colorTransform[0]).toBe(8);
        expect(colorTransform[1]).toBe(7);
        expect(colorTransform[2]).toBe(6);
        expect(colorTransform[3]).toBe(5);
        expect(colorTransform[4]).toBe(4);
        expect(colorTransform[5]).toBe(3);
        expect(colorTransform[6]).toBe(2);
        expect(colorTransform[7]).toBe(1);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            colorTransform: [1, 2, 3, 4, 5, 6, 7, 8]
        };

        const colorTransform = execute(displayObject);
        if (!colorTransform) {
            throw new Error("colorTransform is null");
        }

        expect(colorTransform[0]).toBe(1);
        expect(colorTransform[1]).toBe(2);
        expect(colorTransform[2]).toBe(3);
        expect(colorTransform[3]).toBe(4);
        expect(colorTransform[4]).toBe(5);
        expect(colorTransform[5]).toBe(6);
        expect(colorTransform[6]).toBe(7);
        expect(colorTransform[7]).toBe(8);
    });
});