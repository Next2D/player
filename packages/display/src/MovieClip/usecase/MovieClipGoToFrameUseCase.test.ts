import { execute } from "./MovieClipGoToFrameUseCase";
import { MovieClip } from "../../MovieClip";
import { FrameLabel } from "../../FrameLabel";
import { describe, expect, it } from "vitest";

describe("MovieClipGoToFrameUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        movieClip.totalFrames = 3;

        movieClip.$wait = false;
        movieClip.$canSound = false;
        movieClip.$canAction = false;
        movieClip.$hasTimelineHeadMoved = false;
        
        expect(movieClip.currentFrame).toBe(1);
        expect(movieClip.$wait).toBe(false);
        expect(movieClip.$canSound).toBe(false);
        expect(movieClip.$hasTimelineHeadMoved).toBe(false);

        execute(movieClip, 2);

        expect(movieClip.currentFrame).toBe(2);
        expect(movieClip.$wait).toBe(true);
        expect(movieClip.$canSound).toBe(true);
        expect(movieClip.$hasTimelineHeadMoved).toBe(true);
    });

    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        movieClip.addFrameLabel(new FrameLabel("test", 4));
        movieClip.totalFrames = 3;

        movieClip.$wait = false;
        movieClip.$canSound = false;
        movieClip.$canAction = false;
        movieClip.$hasTimelineHeadMoved = false;
        
        expect(movieClip.currentFrame).toBe(1);
        expect(movieClip.$wait).toBe(false);
        expect(movieClip.$canSound).toBe(false);
        expect(movieClip.$hasTimelineHeadMoved).toBe(false);

        execute(movieClip, "test");

        expect(movieClip.currentFrame).toBe(3);
        expect(movieClip.$wait).toBe(true);
        expect(movieClip.$canSound).toBe(true);
        expect(movieClip.$hasTimelineHeadMoved).toBe(true);
    });
});