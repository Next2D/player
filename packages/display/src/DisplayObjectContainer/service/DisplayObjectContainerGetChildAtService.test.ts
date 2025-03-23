import { execute } from "./DisplayObjectContainerGetChildAtService";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerGetChildAtService.js test", () =>
{
    it("execute test case1", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = container.addChild(new Shape());
        const textField = container.addChild(new TextField());
        const video = container.addChild(new Video(100, 300));
        expect(container.children.length).toBe(3);

        const child0 = execute(container, 0);
        if (!child0) {
            throw new Error("child is null");
        }
        expect(child0.instanceId).toBe(shape.instanceId);

        const child1 = execute(container, 1);
        if (!child1) {
            throw new Error("child is null");
        }
        expect(child1.instanceId).toBe(textField.instanceId);

        const child2 = execute(container, 2);
        if (!child2) {
            throw new Error("child is null");
        }
        expect(child2.instanceId).toBe(video.instanceId);

        expect(execute(container, 3)).toBe(null);
    });
});