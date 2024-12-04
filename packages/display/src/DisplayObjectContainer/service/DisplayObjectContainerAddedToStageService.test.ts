import { execute } from "./DisplayObjectContainerAddedToStageService";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { $stageAssignedMap } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerAddedToStageService.js test", () =>
{
    it("execute test case1 assign stage", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = container.addChild(new Shape());
        $stageAssignedMap.add(shape);

        const textField = container.addChild(new TextField());
        $stageAssignedMap.add(textField);

        const video = container.addChild(new Video(100, 300));
        $stageAssignedMap.add(video);

        expect(container.children.length).toBe(3);

        expect(shape.$addedToStage).toBe(false);
        expect(textField.$addedToStage).toBe(false);
        expect(video.$addedToStage).toBe(false);

        execute(container);

        expect(shape.$addedToStage).toBe(true);
        expect(textField.$addedToStage).toBe(true);
        expect(video.$addedToStage).toBe(true);

        $stageAssignedMap.delete(shape);
        $stageAssignedMap.delete(textField);
        $stageAssignedMap.delete(video);
    });

    it("execute test case2 not assign stage", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = container.addChild(new Shape());
        const textField = container.addChild(new TextField());
        const video = container.addChild(new Video(100, 300));
        expect(container.children.length).toBe(3);

        expect(shape.$addedToStage).toBe(false);
        expect(textField.$addedToStage).toBe(false);
        expect(video.$addedToStage).toBe(false);

        execute(container);

        expect(shape.$addedToStage).toBe(false);
        expect(textField.$addedToStage).toBe(false);
        expect(video.$addedToStage).toBe(false);
    });
});