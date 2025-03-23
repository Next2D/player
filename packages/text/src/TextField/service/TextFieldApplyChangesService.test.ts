import { execute } from "./TextFieldApplyChangesService";
import { DisplayObject } from "@next2d/display";
import { describe, expect, it } from "vitest";

describe("TextFieldApplyChangesService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();

        displayObject.changed = false;
        expect(displayObject.changed).toBe(false);

        execute(displayObject);
        expect(displayObject.changed).toBe(true);
    });
});