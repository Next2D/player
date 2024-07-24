import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("outSine method test", () =>
    {
        expect(Easing.outSine(0.1, 0.5, 0.5, 1)).toBe(0.5782172325201155);
    });
});