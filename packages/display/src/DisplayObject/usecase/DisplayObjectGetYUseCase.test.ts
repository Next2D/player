import { execute } from "./DisplayObjectGetYUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectGetYUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        expect(execute(displayObject)).toBe(0);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix();
        displayObject.$matrix.translate(120, 180);
        expect(execute(displayObject)).toBe(180);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            matrix: [1, 0, 0, 1, 320, 400]
        };
        expect(execute(displayObject)).toBe(400);
    });
});