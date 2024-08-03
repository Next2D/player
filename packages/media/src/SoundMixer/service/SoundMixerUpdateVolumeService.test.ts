import type { Video } from "../../Video";
import type { Sound } from "../../Sound";
import { SoundMixer } from "../../SoundMixer";
import { $getSounds, $getVideos } from "../../MediaUtil";
import { execute } from "./SoundMixerUpdateVolumeService";
import { describe, expect, it, vi } from "vitest";

describe("SoundMixerUpdateVolumeService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockSound = vi.fn().mockImplementation(() =>
        {
            return {
                "volume": 1
            } as unknown as Sound;
        });

        const mockSound = new MockSound();
        const sounds = $getSounds();
        sounds.push(mockSound);

        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "volume": 1
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();
        const videos = $getVideos();
        videos.push(mockVideo);

        // before
        expect(mockSound.volume).toBe(1);
        expect(mockVideo.volume).toBe(1);
        expect(SoundMixer.volume).toBe(1);

        execute(0.5);
        expect(mockSound.volume).toBe(0.5);
        expect(mockVideo.volume).toBe(0.5);
        expect(SoundMixer.volume).toBe(0.5);

        execute(-0.5);
        expect(mockSound.volume).toBe(0);
        expect(mockVideo.volume).toBe(0);
        expect(SoundMixer.volume).toBe(0);

        execute(3);
        expect(mockSound.volume).toBe(1);
        expect(mockVideo.volume).toBe(1);
        expect(SoundMixer.volume).toBe(1);
    });
});