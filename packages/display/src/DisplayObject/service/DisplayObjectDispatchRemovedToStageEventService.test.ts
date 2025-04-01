import { execute } from "./DisplayObjectDispatchRemovedToStageEventService";
import { DisplayObject } from "../../DisplayObject";
import { $stageAssignedMap } from "../../DisplayObjectUtil";
import { describe, expect, it, vi } from "vitest";
import { Event } from "@next2d/events";

describe("DisplayObjectDispatchRemovedToStageEventService.js test", () =>
{
    it("execute test case", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.willTrigger = vi.fn(() => true);
        let type = "";
        displayObject.dispatchEvent = vi.fn((event): boolean =>
        {
            type = event.type;
            return true;
        });

        $stageAssignedMap.add(displayObject.instanceId);

        displayObject.$addedToStage = true;
        expect(type).toBe("");
        expect(displayObject.$addedToStage).toBe(true);

        execute(displayObject);

        expect(type).toBe(Event.REMOVED_FROM_STAGE);
        expect(displayObject.$addedToStage).toBe(false);

        $stageAssignedMap.delete(displayObject.instanceId);
    });
});