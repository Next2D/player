import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inOutBounce method test", () =>
    {
        expect(Easing.inOutBounce(0.1, 0.5, 0.5, 1)).toBe(0.515);
    });

});