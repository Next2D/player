import { execute } from "./DisplayObjectApplyChangesService";
import { DisplayObject } from "../../DisplayObject";
import { $parentMap } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";

describe("DisplayObjectApplyChangesService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();

        displayObject.changed = false;
        expect(displayObject.changed).toBe(false);

        execute(displayObject);
        expect(displayObject.changed).toBe(true);
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        const parent = new DisplayObject();
        $parentMap.set(displayObject, parent);

        parent.changed = false;
        displayObject.changed = false;
        expect(parent.changed).toBe(false);
        expect(displayObject.changed).toBe(false);

        execute(displayObject);
        expect(parent.changed).toBe(true);
        expect(displayObject.changed).toBe(true);

        $parentMap.delete(displayObject);
    });
});