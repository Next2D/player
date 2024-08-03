import { FocusEvent } from "./FocusEvent";
import { describe, expect, it } from "vitest";

describe("FocusEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new FocusEvent("test").namespace).toBe("next2d.events.FocusEvent");
    });

    it("namespace test static", () =>
    {
        expect(FocusEvent.namespace).toBe("next2d.events.FocusEvent");
    });
});

describe("FocusEvent.js property test", () =>
{
    it("FOCUS_IN test", () =>
    {
        expect(FocusEvent.FOCUS_IN).toBe("focusin");
    });

    it("FOCUS_OUT test", () =>
    {
        expect(FocusEvent.FOCUS_OUT).toBe("focusout");
    });
});