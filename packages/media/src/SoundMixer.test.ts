import { SoundMixer } from "./SoundMixer";
import { describe, expect, it } from "vitest";

describe("SoundMixer.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const soundMixer = new SoundMixer();
        expect(soundMixer.namespace).toBe("next2d.media.SoundMixer");
    });

    it("namespace test static", () =>
    {
        expect(SoundMixer.namespace).toBe("next2d.media.SoundMixer");
    });
});