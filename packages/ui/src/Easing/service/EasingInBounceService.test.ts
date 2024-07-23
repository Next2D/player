import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("inBounce method test", function()
    {
        expect(Easing.inBounce(0.1, 0.5, 0.5, 1)).toBe(0.5059375);
    });
});