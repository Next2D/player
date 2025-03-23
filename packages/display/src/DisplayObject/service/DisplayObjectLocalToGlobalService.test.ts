import { execute } from "./DisplayObjectLocalToGlobalService";
import { DisplayObject } from "../../DisplayObject";
import { Matrix, Point } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObjectLocalToGlobalService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        const point = execute(displayObject, new Point(10, 10));
        expect(point.x).toBe(10);
        expect(point.y).toBe(10);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$matrix = new Matrix(1.2, 0.2, -0.3, 1.4, 120, 210);

        const parent = new DisplayObject();
        displayObject.parent = parent;
        parent.$matrix = new Matrix(0.8, 0.122, -0.2213, 1.2, 20, 10);

        const point = execute(displayObject, new Point(10, 10));
        expect(point.x).toBe(73.18620109558105);
        expect(point.y).toBe(296.93801552057266);
    });
});