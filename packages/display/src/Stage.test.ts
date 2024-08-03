import { Stage } from "./Stage";
import { describe, expect, it } from "vitest";

describe("Stage.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Stage().namespace).toBe("next2d.display.Stage");
    });

    it("namespace test static", () =>
    {
        expect(Stage.namespace).toBe("next2d.display.Stage");
    });
});

describe("Stage.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new Stage().toString()).toBe("[object Stage]");
    });
});

describe("Stage.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(Stage.toString()).toBe("[class Stage]");
    });
});