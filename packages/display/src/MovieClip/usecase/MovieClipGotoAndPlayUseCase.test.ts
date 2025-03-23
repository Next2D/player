import { execute } from "./MovieClipGotoAndPlayUseCase";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("MovieClipGotoAndPlayUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        movieClip.stop();

        movieClip.changed = false;
        movieClip.totalFrames = 3;
        
        expect(movieClip.changed).toBe(false);
        expect(movieClip.isPlaying).toBe(false);
        expect(movieClip.currentFrame).toBe(1);

        execute(movieClip, 3);

        expect(movieClip.changed).toBe(true);
        expect(movieClip.isPlaying).toBe(true);
        expect(movieClip.currentFrame).toBe(3);
    });
});