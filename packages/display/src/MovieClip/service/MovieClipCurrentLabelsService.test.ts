import { MovieClip } from "../../MovieClip";
import { FrameLabel } from "../../FrameLabel";
import { execute } from "./MovieClipCurrentLabelsService";
import { describe, expect, it } from "vitest";

describe("MovieClipCurrentLabelsService.js test", () =>
{
    it("execute test case1", () =>
    {
        expect(execute(new MovieClip())).toBe(null);
    });

    it("execute test case2", () =>
    {
        const movieClip = new MovieClip();

        movieClip.$labels = new Map();

        const frameLabel1 = new FrameLabel("label", 2);
        const frameLabel2 = new FrameLabel("label", 1);
        movieClip.$labels.set(2, frameLabel1);
        movieClip.$labels.set(1, frameLabel2);

        const labels = execute(movieClip);
        if (!labels) {
            throw new Error("labels is null");
        }

        expect(labels?.length).toBe(2);
        expect(labels[0]).toBe(frameLabel1);
        expect(labels[1]).toBe(frameLabel2);
    });
});