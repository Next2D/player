import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inOutSine method test", () =>
    {
        expect(Easing.inOutSine(0.1, 0.5, 0.5, 1)).toBe(0.5122358709262116);
    });
});