import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("outElastic method test", () =>
    {
        expect(Easing.outElastic(0.1, 0.5, 0.5, 1)).toBe(1.125);
    });
});