import { execute } from "./DisplayObjectContainerAssignStageAndRootService";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { $rootMap, $stageAssignedMap } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerAssignStageAndRootService.js test", () =>
{
    it("execute test case1 assign stage", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = container.addChild(new Shape());
        const textField = container.addChild(new TextField());
        const video = container.addChild(new Video(100, 300));

        expect(container.children.length).toBe(3);

        expect($rootMap.has(shape)).toBe(false);
        expect($stageAssignedMap.has(shape)).toBe(false);
        expect($rootMap.has(textField)).toBe(false);
        expect($stageAssignedMap.has(textField)).toBe(false);
        expect($rootMap.has(video)).toBe(false);
        expect($stageAssignedMap.has(video)).toBe(false);

        execute(container);

        expect($rootMap.has(shape)).toBe(true);
        expect($stageAssignedMap.has(shape)).toBe(true);
        expect($rootMap.has(textField)).toBe(true);
        expect($stageAssignedMap.has(textField)).toBe(true);
        expect($rootMap.has(video)).toBe(true);
        expect($stageAssignedMap.has(video)).toBe(true);

        $rootMap.delete(shape);
        $rootMap.delete(textField);
        $rootMap.delete(video);
        $stageAssignedMap.delete(shape);
        $stageAssignedMap.delete(textField);
        $stageAssignedMap.delete(video);
    });
});