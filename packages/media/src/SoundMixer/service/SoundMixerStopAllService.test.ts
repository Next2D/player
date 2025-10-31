import type { Video } from "../../Video";
import type { Sound } from "../../Sound";
import { $getPlayingSounds, $getPlayingVideos } from "../../MediaUtil";
import { execute } from "./SoundMixerStopAllService";
import { describe, expect, it, vi } from "vitest";

describe("SoundMixerStopAllService.js test", () =>
{
    it("execute test case1", () =>
    {
        let soundState = "";
        const MockSound = vi.fn(function(this: any) {
            this.stop = vi.fn(() => { soundState = "stop" });
        }) as any;

        const playingSounds = $getPlayingSounds();
        playingSounds.push(new MockSound());

        let videoState = "";
        const MockVideo = vi.fn(function(this: any) {
            this.pause = vi.fn(() => { videoState = "pause" });
        }) as any;

        const playingVideos = $getPlayingVideos();
        playingVideos.push(new MockVideo());

        // before
        expect(soundState).toBe("");
        expect(videoState).toBe("");
        expect(playingSounds.length).toBe(1);
        expect(playingVideos.length).toBe(1);

        execute();

        // after
        expect(soundState).toBe("stop");
        expect(videoState).toBe("pause");
        expect(playingSounds.length).toBe(0);
        expect(playingVideos.length).toBe(0);
    });
});