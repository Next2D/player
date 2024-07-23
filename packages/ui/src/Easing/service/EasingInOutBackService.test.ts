import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", function()
{
    it("inOutBack method test", function()
    {
        expect(Easing.inOutBack(0.1, 0.5, 0.5, 1)).toBe(0.481240724);
    });
});