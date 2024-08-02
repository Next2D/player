import { LoaderInfo } from "./LoaderInfo";
import { describe, expect, it } from "vitest";

describe("LoaderInfo.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new LoaderInfo().namespace).toBe("next2d.display.LoaderInfo");
    });

    it("namespace test static", () =>
    {
        expect(LoaderInfo.namespace).toBe("next2d.display.LoaderInfo");
    });
});

describe("LoaderInfo.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new LoaderInfo().toString()).toBe("[object LoaderInfo]");
    });
});

describe("LoaderInfo.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(LoaderInfo.toString()).toBe("[class LoaderInfo]");
    });
});