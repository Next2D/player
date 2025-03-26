import { execute } from "./DisplayObjectRemoveService";
import { DisplayObject } from "../../DisplayObject";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("DisplayObjectRemoveService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        const movieClip = new MovieClip();
        movieClip.addChild(displayObject);

        expect(movieClip.numChildren).toBe(1);
        execute(displayObject);
        expect(movieClip.numChildren).toBe(0);
    });
});