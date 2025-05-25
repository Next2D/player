import { execute } from "./DisplayObjectGetRotationUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectGetRotationUseCase.js test", () =>
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
        displayObject.$matrix.rotate(50 / 180 * Math.PI);
        expect(execute(displayObject)).toBe(49.99999868188683);
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
        expect(execute(displayObject)).toBe(45);
    });

    it("execute test case4", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = {
            matrix: [-1, 0, 0, 1, 0, 0]
        };
        expect(execute(displayObject)).toBe(0);
    });
});