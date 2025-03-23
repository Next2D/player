import { execute } from "./MovieClipAdvanceFrameUseCase";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("MovieClipAdvanceFrameUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();

        movieClip.changed = false;
        movieClip.totalFrames = 10;
        movieClip.$wait = true;

        expect(movieClip.changed).toBe(false);
        expect(movieClip.$wait).toBe(true);
        expect(movieClip.currentFrame).toBe(1);

        execute(movieClip);

        expect(movieClip.changed).toBe(true);
        expect(movieClip.$wait).toBe(false);
        expect(movieClip.currentFrame).toBe(1);
    });

    it("execute test case2", () =>
    {
        const movieClip = new MovieClip();

        movieClip.changed = false;
        movieClip.totalFrames = 10;

        expect(movieClip.changed).toBe(false);
        expect(movieClip.currentFrame).toBe(1);

        execute(movieClip);

        expect(movieClip.changed).toBe(true);
        expect(movieClip.currentFrame).toBe(2);
    });

    it("execute test case3", () =>
    {
        const movieClip = new MovieClip();

        movieClip.changed = false;
        movieClip.currentFrame = movieClip.totalFrames = 2;

        expect(movieClip.changed).toBe(false);
        expect(movieClip.currentFrame).toBe(2);

        execute(movieClip);

        expect(movieClip.changed).toBe(true);
        expect(movieClip.currentFrame).toBe(1);
    });
});