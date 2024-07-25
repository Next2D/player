import { SoundTransform } from "./SoundTransform";
import { describe, expect, it } from "vitest";

describe("SoundTransform.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const soundTransform = new SoundTransform();
        expect(soundTransform.namespace).toBe("next2d.media.SoundTransform");
    });

    it("namespace test static", () =>
    {
        expect(SoundTransform.namespace).toBe("next2d.media.SoundTransform");
    });
});

describe("SoundTransform.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new SoundTransform().toString()).toBe("[object SoundTransform]");
    });
});

describe("SoundTransform.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(SoundTransform.toString()).toBe("[class SoundTransform]");
    });
});

describe("SoundTransform.js property test", () =>
{
    it("volume test case1", () =>
    {
        const soundTransform = new SoundTransform();
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test case2", () =>
    {
        const soundTransform = new SoundTransform();
        soundTransform.volume = 100;
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test case3", () =>
    {
        const soundTransform = new SoundTransform();
        soundTransform.volume = -32;
        expect(soundTransform.volume).toBe(0);
    });

    it("volume test case4", () =>
    {
        const soundTransform = new SoundTransform(100);
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test case5", () =>
    {
        const soundTransform = new SoundTransform(-32);
        expect(soundTransform.volume).toBe(0);
    });
});