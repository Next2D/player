import { Tween } from "./Tween";
import { describe, expect, it } from "vitest";

describe("Tween.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Tween().namespace).toBe("next2d.ui.Tween");
    });

    it("namespace test static", () =>
    {
        expect(Tween.namespace).toBe("next2d.ui.Tween");
    });
});