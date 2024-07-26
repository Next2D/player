import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("outExpo method test", () =>
    {
        expect(Easing.outExpo(0.1, 0.5, 0.5, 1)).toBe(0.75);
    });
});