import { execute } from "./DisplayObjectGetFiltersUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";
import { BlurFilter } from "@next2d/filters";

describe("DisplayObjectGetFiltersUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        expect(execute(displayObject)).toBe(null);
    });
    
    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$filters = [new BlurFilter(), new BlurFilter()];
        const filters = execute(displayObject);
        expect(filters?.length).toBe(2);
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.filters = [new BlurFilter()];
        const filters = execute(displayObject);
        expect(filters?.length).toBe(1);
    });
});