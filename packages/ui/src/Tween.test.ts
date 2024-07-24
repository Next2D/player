import { Tween } from "./Tween";
import { describe, expect, it } from "vitest";

describe("Tween.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new Tween().toString()).toBe("[object Tween]");
    });
});

describe("Tween.js static toString test", function()
{
    it("static toString test", function()
    {
        expect(Tween.toString()).toBe("[class Tween]");
    });
});

describe("Tween.js namespace test", function()
{
    it("namespace test public", function()
    {
        expect(new Tween().namespace).toBe("next2d.ui.Tween");
    });

    it("namespace test static", function()
    {
        expect(Tween.namespace).toBe("next2d.ui.Tween");
    });
});