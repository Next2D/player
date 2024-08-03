import { Sound } from "./Sound";
import { describe, expect, it } from "vitest";

describe("Sound.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Sound().namespace).toBe("next2d.media.Sound");
    });

    it("namespace test static", () =>
    {
        expect(Sound.namespace).toBe("next2d.media.Sound");
    });
});