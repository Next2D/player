import { execute } from "./DisplayObjectSetBlendModeUseCase";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it } from "vitest";

describe("DisplayObjectSetBlendModeUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$blendMode).toBe(null);

        execute(displayObject, "copy");
        
        expect(displayObject.changed).toBe(true);
        expect(displayObject.$blendMode).toBe("copy");
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.$blendMode = "darken";
        displayObject.changed = false;

        expect(displayObject.changed).toBe(false);
        expect(displayObject.$blendMode).toBe("darken");

        execute(displayObject, "darken");
        
        expect(displayObject.changed).toBe(false);
        expect(displayObject.$blendMode).toBe("darken");
    });
});