import { execute } from "./DisplayObjectContainerGetChildByNameService";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerGetChildByNameService.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();
        const shape = container.addChild(new Shape());
        shape.name = "shape";

        const textField = container.addChild(new TextField());
        textField.name = "textField";

        const video = container.addChild(new Video(100, 300));
        video.name = "video";

        expect(execute(container, "")).toBe(null);
        expect(execute(container, "shape")).toBe(shape);
        expect(execute(container, "textField")).toBe(textField);
        expect(execute(container, "video")).toBe(video);
    });
});