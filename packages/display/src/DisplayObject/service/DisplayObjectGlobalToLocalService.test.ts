import { execute } from "./DisplayObjectGlobalToLocalService";
import { DisplayObject } from "../../DisplayObject";
import { Matrix, Point } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGlobalToLocalService.js test", () =>
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
        expect(point.x).toBe(-142.32785326242447);
        expect(point.y).toBe(-128.78454852104187);
    });
});