import { execute } from "./MovieClipPrepareSoundUseCase";
import { MovieClip } from "../../MovieClip";
import { $sounds } from "../../DisplayObjectUtil";
import { describe, expect, it } from "vitest";
import { Sound } from "@next2d/media";

describe("MovieClipPrepareSoundUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const movieClip = new MovieClip();
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [new Sound()]);

        movieClip.$canSound = true;
        $sounds.length = 0;

        expect(movieClip.$canSound).toBe(true);
        expect($sounds.length).toBe(0);

        execute(movieClip);

        expect(movieClip.$canSound).toBe(false);
        expect($sounds.length).toBe(1);
        $sounds.length = 0;
    });
});