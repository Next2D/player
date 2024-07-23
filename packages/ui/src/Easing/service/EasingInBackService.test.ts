import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("inCubic method test", function()
    {
        expect(Easing.inCirc(0.1, 0.5, 0.5, 1)).toBe(0.5025062814466901);
    });
});