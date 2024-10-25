import { execute } from "./DisplayObjectGetScaleXUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectGetScaleXUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        expect(execute(displayObject)).toBe(1);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$scaleX = 4;
        expect(execute(displayObject)).toBe(4);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix();
        displayObject.$matrix.scale(3, 1);
        expect(execute(displayObject)).toBe(3);
    });

    it("execute test case4", () =>
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