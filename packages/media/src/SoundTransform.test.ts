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