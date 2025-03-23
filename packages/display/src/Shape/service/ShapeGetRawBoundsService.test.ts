import { execute } from "./ShapeGetRawBoundsService";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeRawBoundsService.js test", () =>
{
    it("execute test case", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 1;
        shape.graphics.yMin = 2;
        shape.graphics.xMax = 3;
        shape.graphics.yMax = 4;
        const bounds = execute(shape);

        expect(bounds[0]).toBe(1);
        expect(bounds[1]).toBe(2);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });
});