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

describe("SoundMixer.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new SoundMixer().toString()).toBe("[object SoundMixer]");
    });
});

describe("SoundMixer.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(SoundMixer.toString()).toBe("[class SoundMixer]");
    });
});