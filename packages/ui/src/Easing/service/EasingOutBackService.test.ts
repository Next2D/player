import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("outBack method test", function()
    {
        expect(Easing.outBack(0.1, 0.5, 0.5, 1)).toBe(0.7044139899999999);
    });
});