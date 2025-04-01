import { MovieClip } from "../../MovieClip";
import { execute } from "./MovieClipBuildSoundsService";
import { describe, expect, it } from "vitest";
import { $loaderInfoMap } from "../../DisplayObjectUtil";
import { LoaderInfo } from "../..";
import { Sound } from "@next2d/media";
import type { IMovieClipSoundObject } from "../../interface/IMovieClipSoundObject";

describe("MovieClipBuildSoundsService.js test", () =>
{
    it("execute test", async () =>
    {
        const movieClip = new MovieClip();
        const loaderInfo = new LoaderInfo();
        loaderInfo.data = {
            "characters": [
                // @ts-ignore
                {},
                {
                    "buffer": [],
                    // @ts-ignore
                    "audioBuffer": new ArrayBuffer(0)
                }
            ]
        };
        $loaderInfoMap.set(movieClip, loaderInfo);


        const soundMap = new Map<number, Sound[]>();
        const soundObjects: IMovieClipSoundObject[] = [{
            "frame": 1,
            "sound": [{
                "characterId": 1,
                "volume": 1,
                "autoPlay" : true,
                "loopCount": 1
            }]
        }];

        expect(soundMap.size).toBe(0);
        await execute(movieClip, soundMap, soundObjects);
        expect(soundMap.size).toBe(1);

        $loaderInfoMap.delete(movieClip);
    });
});