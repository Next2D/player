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