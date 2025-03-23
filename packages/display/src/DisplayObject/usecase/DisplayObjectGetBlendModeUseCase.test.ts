import { execute } from "./DisplayObjectGetBlendModeUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetBlendModeUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        expect(execute(displayObject)).toBe("normal");
    });
    
    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$blendMode = "add";
        expect(execute(displayObject)).toBe("add");
    });

    it("execute test case3", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.placeObject = { blendMode: "alpha" };
        expect(execute(displayObject)).toBe("alpha");
    });
});