import { PointerEvent } from "./PointerEvent";
import { describe, expect, it } from "vitest";

describe("PointerEvent.js property test", () =>
{
    it("DOUBLE_CLICK test", () =>
    {
        expect(PointerEvent.DOUBLE_CLICK).toBe("dblclick");
    });

    it("POINTER_DOWN test", () =>
    {
        expect(PointerEvent.POINTER_DOWN).toBe("pointerdown");
    });

    it("POINTER_MOVE test", () =>
    {
        expect(PointerEvent.POINTER_MOVE).toBe("pointermove");
    });

    it("POINTER_OUT test", () =>
    {
        expect(PointerEvent.POINTER_OUT).toBe("pointerout");
    });

    it("POINTER_OVER test", () =>
    {
        expect(PointerEvent.POINTER_OVER).toBe("pointerover");
    });

    it("POINTER_UP test", () =>
    {
        expect(PointerEvent.POINTER_UP).toBe("pointerup");
    });
});