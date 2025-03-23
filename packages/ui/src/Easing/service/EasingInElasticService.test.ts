import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inElastic method test", () =>
    {
        expect(Easing.inElastic(0.1, 0.5, 0.5, 1)).toBe(0.5009765625);
    });
});