import { execute } from "./DisplayObjectContainerUnAssignStageAndRootService";
import { Shape } from "../../Shape";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { $rootMap, $stageAssignedMap } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerUnAssignStageAndRootService.js test", () =>
{
    it("execute test case1 assign stage", () =>
    {
        const container = new DisplayObjectContainer();

        const shape = container.addChild(new Shape());
        $rootMap.set(shape, null);
        $stageAssignedMap.add(shape);

        const textField = container.addChild(new TextField());
        $rootMap.set(textField, null);
        $stageAssignedMap.add(textField);

        const video = container.addChild(new Video(100, 300));
        $rootMap.set(video, null);
        $stageAssignedMap.add(video);

        expect(container.children.length).toBe(3);

        expect($rootMap.has(shape)).toBe(true);
        expect($stageAssignedMap.has(shape)).toBe(true);
        expect($rootMap.has(textField)).toBe(true);
        expect($stageAssignedMap.has(textField)).toBe(true);
        expect($rootMap.has(video)).toBe(true);
        expect($stageAssignedMap.has(video)).toBe(true);

        execute(container);

        expect($rootMap.has(shape)).toBe(false);
        expect($stageAssignedMap.has(shape)).toBe(false);
        expect($rootMap.has(textField)).toBe(false);
        expect($stageAssignedMap.has(textField)).toBe(false);
        expect($rootMap.has(video)).toBe(false);
        expect($stageAssignedMap.has(video)).toBe(false);
    });
});