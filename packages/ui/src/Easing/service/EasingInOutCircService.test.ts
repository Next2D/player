import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inOutCirc method test", () =>
    {
        expect(Easing.inOutCirc(0.1, 0.5, 0.5, 1)).toBe(0.5003126955570227);
    });
});