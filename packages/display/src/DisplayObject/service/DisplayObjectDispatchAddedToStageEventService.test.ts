import { execute } from "./DisplayObjectDispatchAddedToStageEventService";
import { DisplayObject } from "../../DisplayObject";
import { $stageAssignedMap } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";

describe("DisplayObjectDispatchAddedToStageEventService.js test", () =>
{
    it("execute test case", () =>
    {
        const displayObject = new DisplayObject();
        $stageAssignedMap.add(displayObject.instanceId);

        expect(displayObject.$addedToStage).toBe(false);
        execute(displayObject);

        $stageAssignedMap.delete(displayObject.instanceId);
        expect(displayObject.$addedToStage).toBe(true);
    });
});