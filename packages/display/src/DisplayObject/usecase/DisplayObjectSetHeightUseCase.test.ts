import { execute } from "./DisplayObjectSetHeightUseCase";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Video } from "@next2d/media";
import { TextField } from "@next2d/text";
import { describe, expect, it } from "vitest";

describe("DisplayObjectSetHeightUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const shape = new Shape();
        shape.graphics.yMax = 100;
        shape.graphics.yMin = 200;
        shape.changed = false;

        expect(shape.changed).toBe(false);
        expect(shape.$scaleY).toBe(null);
        expect(shape.$matrix).toBe(null);

        execute(shape, 50);
        
        expect(shape.changed).toBe(true);
        expect(shape.$scaleY).toBe(0.5);

        const rawData = shape.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(1);
        expect(rawData[1]).toBe(0);
        expect(rawData[2]).toBe(0);
        expect(rawData[3]).toBe(0.5);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
    });

    it("execute test case2", () =>
    {
        const video = new Video(100, 200);
        video.changed = false;

        expect(video.changed).toBe(false);
        expect(video.$scaleY).toBe(null);
        expect(video.$matrix).toBe(null);

        execute(video, 50);
            
        expect(video.changed).toBe(true);
        expect(video.$scaleY).toBe(0.25);

        const rawData = video.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(1);
        expect(rawData[1]).toBe(0);
        expect(rawData[2]).toBe(0);
        expect(rawData[3]).toBe(0.25);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
    });

    it("execute test case3", () =>
    {
        const container = new DisplayObjectContainer();
        container.changed = false;
        expect(container.changed).toBe(false);

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

        execute(container, 100);

        expect(container.changed).toBe(true);

        const rawData = container.$matrix?.rawData;
        if (!rawData) {
            throw new Error("rawData is null");
        }

        expect(rawData[0]).toBe(1);
        expect(rawData[1]).toBe(0);
        expect(rawData[2]).toBe(0);
        expect(rawData[3]).toBe(0.3333333432674408);
        expect(rawData[4]).toBe(0);
        expect(rawData[5]).toBe(0);
    });
});