import { execute } from "./DisplayObjectGetWidthUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Video } from "@next2d/media";
import { TextField } from "@next2d/text";
import { Matrix } from "@next2d/geom";
import { describe, expect, it } from "vitest";

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

    it("execute test video case1", () =>
    {
        const video = new Video(100, 300);
        expect(execute(video)).toBe(100);
    });

    it("execute test video case2", () =>
    {
        const video = new Video(100, 300);
        video.$matrix = new Matrix();
        video.$matrix.scale(2, 3);

        expect(execute(video)).toBe(200);
    });

    it("execute test text case1", () =>
    {
        const textField = new TextField();
        expect(execute(textField)).toBe(100);
    });

    it("execute test text case2", () =>
    {
        const textField = new TextField();
        textField.$matrix = new Matrix();
        textField.$matrix.scale(2, 3);

        expect(execute(textField)).toBe(200);
    });

    it("execute test container case1", () =>
    {
        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 120;
        shape.graphics.xMax = 220;
        shape.graphics.yMin = 120;
        shape.graphics.yMax = 220;
        container.addChild(shape);

        const textField = new TextField();
        container.addChild(textField);

        const video = new Video(100, 300);
        container.addChild(video);

        expect(execute(container)).toBe(220);
    });

    it("execute test container case2", () =>
    {
        const container = new DisplayObjectContainer();
        container.$matrix = new Matrix();
        container.$matrix.scale(2, 3);

        const shape = new Shape();
        shape.graphics.xMin = -20;
        shape.graphics.xMax = 120;
        shape.graphics.yMin = -20;
        shape.graphics.yMax = 20;
        container.addChild(shape);

        const textField = new TextField();
        container.addChild(textField);

        const video = new Video(100, 300);
        container.addChild(video);

        expect(execute(container)).toBe(280);
    });
});