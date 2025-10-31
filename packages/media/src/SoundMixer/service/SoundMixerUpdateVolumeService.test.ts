import type { Video } from "../../Video";
import type { Sound } from "../../Sound";
import { SoundMixer } from "../../SoundMixer";
import { $clamp } from "../../MediaUtil";
import { $getPlayingSounds, $getPlayingVideos } from "../../MediaUtil";
import { execute } from "./SoundMixerUpdateVolumeService";
import { describe, expect, it, vi } from "vitest";

describe("SoundMixerUpdateVolumeService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockSound = vi.fn(function(this: any) {
            let volume = 1;
            Object.defineProperty(this, 'volume', {
                get(): number {
                    return volume;
                },
                set(value: number) {
                    volume = $clamp(value, 0, 1);
                }
            });
        }) as any;

        const mockSound = new MockSound();
        const playingSounds = $getPlayingSounds();
        playingSounds.push(mockSound);

        const MockVideo = vi.fn(function(this: any) {
            let volume = 1;
            Object.defineProperty(this, 'volume', {
                get(): number {
                    return volume;
                },
                set(value: number) {
                    volume = $clamp(value, 0, 1);
                }
            });
        }) as any;

        const mockVideo = new MockVideo();
        const playingVideos = $getPlayingVideos();
        playingVideos.push(mockVideo);

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