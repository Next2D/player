import { Easing } from "./Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Easing().namespace).toBe("next2d.ui.Easing");
    });

    it("namespace test static", () =>
    {
        expect(Easing.namespace).toBe("next2d.ui.Easing");
    });
});