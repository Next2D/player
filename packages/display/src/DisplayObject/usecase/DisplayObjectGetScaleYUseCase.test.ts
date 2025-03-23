import { execute } from "./DisplayObjectGetScaleYUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectGetScaleYUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        expect(execute(displayObject)).toBe(1);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix();
        displayObject.$matrix.scale(1, 3);
        expect(execute(displayObject)).toBe(3);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            matrix: [
                0.7071067690849304,
                0.7071067690849304,
                -0.7071067690849304,
                0.7071067690849304,
                0,
                0
            ]
        };
        expect(execute(displayObject)).toBe(1);
    });
});