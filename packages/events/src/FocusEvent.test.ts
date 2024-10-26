import { FocusEvent } from "./FocusEvent";
import { describe, expect, it } from "vitest";

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