import { execute } from "./MovieClipNextFrameUseCase";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("MovieClipNextFrameUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();

        movieClip.changed = false;
        movieClip.totalFrames = 3;
        
        expect(movieClip.changed).toBe(false);
        expect(movieClip.isPlaying).toBe(true);
        expect(movieClip.currentFrame).toBe(1);

        execute(movieClip);

        expect(movieClip.changed).toBe(true);
        expect(movieClip.isPlaying).toBe(false);
        expect(movieClip.currentFrame).toBe(2);
    });

    it("execute test case2", () =>
    {
        const movieClip = new MovieClip();

        movieClip.changed = false;
        movieClip.totalFrames = 1;
        
        expect(movieClip.changed).toBe(false);
        expect(movieClip.isPlaying).toBe(true);
        expect(movieClip.currentFrame).toBe(1);

        execute(movieClip);

        expect(movieClip.changed).toBe(false);
        expect(movieClip.isPlaying).toBe(true);
        expect(movieClip.currentFrame).toBe(1);
    });
});