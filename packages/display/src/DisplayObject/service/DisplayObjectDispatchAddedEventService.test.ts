import { execute } from "./DisplayObjectDispatchAddedEventService";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectDispatchAddedEventService.js test", () =>
{
    it("execute test case", () =>
    {
        const displayObject = new DisplayObject();
        expect(displayObject.$added).toBe(false);
        execute(displayObject);
        expect(displayObject.$added).toBe(true);
    });
});