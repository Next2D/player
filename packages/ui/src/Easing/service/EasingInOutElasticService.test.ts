import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inOutElastic method test", () =>
    {
        expect(Easing.inOutElastic(0.1, 0.5, 0.5, 1)).toBe(0.5001695782985028);
    });
});