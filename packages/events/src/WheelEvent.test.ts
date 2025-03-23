import { WheelEvent } from "./WheelEvent";
import { describe, expect, it } from "vitest";

describe("WheelEvent.js property test", () =>
{
    it("WHEEL test", () => {
        expect(WheelEvent.WHEEL).toBe("wheel");
    });
});