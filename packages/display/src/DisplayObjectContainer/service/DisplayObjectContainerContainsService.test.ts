import { execute } from "./DisplayObjectContainerContainsService";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerContainsService.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        const shape = container.addChild(new Shape());

        const sprite1 = container.addChild(new DisplayObjectContainer());
        const textField = sprite1.addChild(new TextField());

        const sprite2 = sprite1.addChild(new DisplayObjectContainer());
        const video = sprite2.addChild(new Video(100, 300));

        expect(execute(container, shape)).toBe(true);
        expect(execute(container, textField)).toBe(true);
        expect(execute(container, video)).toBe(true);
        expect(execute(container, container)).toBe(true);
        expect(execute(container, sprite1)).toBe(true);
        expect(execute(container, sprite2)).toBe(true);

        expect(execute(sprite1, shape)).toBe(false);
        expect(execute(sprite2, textField)).toBe(false);
    });
});