import { Easing } from "./Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new Easing().toString()).toBe("[object Easing]");
    });
});

describe("Easing.js static toString test", function()
{
    it("static toString test", function()
    {
        expect(Easing.toString()).toBe("[class Easing]");
    });
});

describe("Easing.js namespace test", function()
{
    it("namespace test public", function()
    {
        expect(new Easing().namespace).toBe("next2d.ui.Easing");
    });

    it("namespace test static", function()
    {
        expect(Easing.namespace).toBe("next2d.ui.Easing");
    });
});