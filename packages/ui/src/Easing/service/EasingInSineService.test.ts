import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inSine method test", () =>
    {
        expect(Easing.inSine(0.1, 0.5, 0.5, 1)).toBe(0.5061558297024311);
    });
});