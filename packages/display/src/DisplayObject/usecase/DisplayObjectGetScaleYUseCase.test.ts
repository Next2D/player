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

    it("execute test case4", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.rotation = 190;
        displayObject.scaleY = -1.56;
        expect(execute(displayObject)).toBe(-1.56);
        displayObject.scaleY = 0.56;

        const matrix = displayObject.$matrix;
        if (!matrix) {
            throw new Error("Matrix is not defined");
        }

        const rawData = matrix.rawData;
        expect(rawData[0]).toBe(-0.9848077297210693);
        expect(rawData[1]).toBe(-0.1736481785774231);
        expect(rawData[2]).toBe(-0.09724298119544983);
        expect(rawData[3]).toBe(0.5514923334121704);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);

        expect(execute(displayObject)).toBe(0.56);

    });
});