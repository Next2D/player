import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("inSine method test", function()
    {
        expect(Easing.inSine(0.1, 0.5, 0.5, 1)).toBe(0.5061558297024311);
    });
});