import { MovieClip } from "../../MovieClip";
import { FrameLabel } from "../../FrameLabel";
import { execute } from "./MovieClipGetFrameForLabelService";
import { describe, expect, it } from "vitest";

describe("MovieClipGetFrameForLabelService.js test", () =>
{
    it("execute test case1", () =>
    {
        expect(execute(new MovieClip(), "")).toBe(0);
    });

    it("execute test case2", () =>
    {
        const movieClip = new MovieClip();

        movieClip.$labels = new Map();

        const frameLabel1 = new FrameLabel("labelA", 2);
        const frameLabel2 = new FrameLabel("labelB", 1);
        movieClip.$labels.set(2, frameLabel1);
        movieClip.$labels.set(1, frameLabel2);

        expect(execute(movieClip, "labelA")).toBe(2);
        expect(execute(movieClip, "labelB")).toBe(1);
        expect(execute(movieClip, "labelC")).toBe(0);
    });
});