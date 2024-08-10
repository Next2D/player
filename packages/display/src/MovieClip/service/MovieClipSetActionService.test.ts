import { MovieClip } from "../../MovieClip";
import { $actions } from "../../DisplayObjectUtil";
import { execute } from "./MovieClipSetActionService";
import { describe, expect, it } from "vitest";

describe("MovieClipSetActionService.js test", () =>
{
    it("execute test case1", () =>
    {
        const actions = new Map<number, Function[]>();
        actions.set(1, [() => {}]);

        const movieClip = new MovieClip();

        $actions.length = 0;
        expect($actions.length).toBe(0);
        execute(movieClip, actions);
        expect($actions.length).toBe(2);
    });

    it("execute test case2", () =>
    {
        const actions = new Map<number, Function[]>();
        actions.set(2, [() => {}]);

        const movieClip = new MovieClip();

        $actions.length = 0;
        expect($actions.length).toBe(0);
        execute(movieClip, actions);
        expect($actions.length).toBe(0);
    });
});