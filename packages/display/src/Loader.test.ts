import { Loader } from "./Loader";
import { describe, expect, it } from "vitest";

describe("Loader.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Loader().namespace).toBe("next2d.display.Loader");
    });

    it("namespace test static", () =>
    {
        expect(Loader.namespace).toBe("next2d.display.Loader");
    });
});