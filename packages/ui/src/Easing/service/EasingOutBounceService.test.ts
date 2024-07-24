import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("outBounce method test", () =>
    {
        expect(Easing.outBounce(0.1, 0.5, 0.5, 1)).toBe(0.5378125);
    });
});