import { execute } from "./MovieClipPrepareActionUseCase";
import { MovieClip } from "../../MovieClip";
import { $actions } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";

describe("MovieClipPrepareActionUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        movieClip.$actions = new Map();
        movieClip.$actions.set(1, [() => {}]);

        movieClip.$canAction = true;
        $actions.length = 0;

        expect(movieClip.$canAction).toBe(true);
        expect($actions.length).toBe(0);

        execute(movieClip);

        expect(movieClip.$canAction).toBe(false);
        expect($actions.length).toBe(1);
        $actions.length = 0;
    });
});