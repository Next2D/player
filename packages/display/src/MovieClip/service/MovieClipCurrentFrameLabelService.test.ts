import { MovieClip } from "../../MovieClip";
import { FrameLabel } from "../../FrameLabel";
import { execute } from "./MovieClipCurrentFrameLabelService";
import { describe, expect, it } from "vitest";

describe("MovieClipCurrentFrameLabelService.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        const frameLabel = new FrameLabel("label", 1);

        movieClip.$labels = new Map();
        movieClip.$labels.set(frameLabel.frame, frameLabel);
        expect(movieClip.$labels.size).toBe(1);

        expect(execute(movieClip)).toBe(frameLabel);
    });

    it("execute test case2", () =>
    {
        expect(execute(new MovieClip())).toBe(null);
    });

    it("execute test case3", () =>
    {
        const movieClip = new MovieClip();
        const frameLabel = new FrameLabel("label", 2);

        movieClip.$labels = new Map();
        movieClip.$labels.set(frameLabel.frame, frameLabel);
        expect(movieClip.$labels.size).toBe(1);

        expect(execute(movieClip)).toBe(null);
    });
});