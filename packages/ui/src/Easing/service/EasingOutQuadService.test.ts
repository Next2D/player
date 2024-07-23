import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("outQuad method test", function()
    {
        expect(Easing.outQuad(0.1, 0.5, 0.5, 1)).toBe(0.595);
    });
});