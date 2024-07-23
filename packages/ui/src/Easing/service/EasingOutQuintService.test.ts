import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("outQuint method test", function()
    {
        expect(Easing.outQuint(0.1, 0.5, 0.5, 1)).toBe(0.7047549999999999);
    });
});