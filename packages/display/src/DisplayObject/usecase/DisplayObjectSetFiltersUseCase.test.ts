import { execute } from "./DisplayObjectSetFiltersUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { BlurFilter } from "@next2d/filters";

describe("DisplayObjectSetFiltersUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$filters).toBe(null);

        const filters = [new BlurFilter()];
        execute(displayObject, filters);
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$filters).toBe(filters);
    });
});