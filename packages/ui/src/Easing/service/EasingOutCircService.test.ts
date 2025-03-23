import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("outCirc method test", () =>
    {
        expect(Easing.outCirc(0.1, 0.5, 0.5, 1)).toBe(0.7179449471770336);
    });
});