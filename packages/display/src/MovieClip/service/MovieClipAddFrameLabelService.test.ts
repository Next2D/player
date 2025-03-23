import { MovieClip } from "../../MovieClip";
import { FrameLabel } from "../../FrameLabel";
import { execute } from "./MovieClipAddFrameLabelService";
import { describe, expect, it } from "vitest";

describe("MovieClipAddFrameLabelService.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        const frameLabel = new FrameLabel("label", 1);

        expect(movieClip.$labels).toBe(null);
        execute(movieClip, frameLabel);
        expect(movieClip.$labels?.size).toBe(1);
    });
});