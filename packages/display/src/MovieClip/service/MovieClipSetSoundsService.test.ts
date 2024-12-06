import { MovieClip } from "../../MovieClip";
import { $sounds } from "../../DisplayObjectUtil";
import { Sound } from "@next2d/media";
import { execute } from "./MovieClipSetSoundsService";
import { describe, expect, it } from "vitest";

describe("MovieClipSetSoundsService.js test", () =>
{
    it("execute test case1", () =>
    {
        const sounds = new Map<number, Sound[]>();
        sounds.set(1, [new Sound(), new Sound()]);

        const movieClip = new MovieClip();

        $sounds.length = 0;
        expect($sounds.length).toBe(0);
        execute(movieClip, sounds);
        expect($sounds.length).toBe(2);
    });

    it("execute test case2", () =>
    {
        const sounds = new Map<number, Sound[]>();
        sounds.set(2, [new Sound(), new Sound()]);

        const movieClip = new MovieClip();

        $sounds.length = 0;
        expect($sounds.length).toBe(0);
        execute(movieClip, sounds);
        expect($sounds.length).toBe(0);
    });
});