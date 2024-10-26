import { execute } from "./DisplayObjectGetWidthUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("DisplayObjectGetWidthUseCase.js test", () =>
{
    it("execute test shape case1", () =>
    {
        const shape = new Shape();
        shape.graphics.xMin = 10;
        shape.graphics.xMax = 100;
        shape.graphics.yMin = 20;
        shape.graphics.yMax = 200;
        expect(execute(shape)).toBe(90);
    });

    it("execute test shape case2", () =>
    {
        const shape = new Shape();
        shape.$matrix = new Matrix();
        shape.$matrix.scale(2, 3);

        shape.graphics.xMin = 10;
        shape.graphics.xMax = 100;
        shape.graphics.yMin = 20;
        shape.graphics.yMax = 200;

        expect(execute(shape)).toBe(180);
    });
});