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

describe("Sound.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new Sound().toString()).toBe("[object Sound]");
    });
});

describe("Sound.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(Sound.toString()).toBe("[class Sound]");
    });
});