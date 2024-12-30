import { execute } from "./DisplayObjectContainerCalcBoundsMatrixUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Matrix } from "@next2d/geom";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerCalcBoundsMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        container.$matrix = new Matrix();
        container.$matrix.scale(2, 3);

        const shape = new Shape();
        shape.$matrix = new Matrix();
        shape.$matrix.scale(1.1, 1.2);

        shape.graphics.xMin = -120;
        shape.graphics.xMax = 20;
        shape.graphics.yMin = -120;
        shape.graphics.yMax = 20;
        container.addChild(shape);

        const textField = new TextField();
        container.addChild(textField);

        const video = new Video(100, 300);
        container.addChild(video);

        const bounds = execute(container);
        expect(bounds[0]).toBe(-264);
        expect(bounds[1]).toBe(-432.0000305175781);
        expect(bounds[2]).toBe(200);
        expect(bounds[3]).toBe(900);
    });
});