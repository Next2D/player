import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("outQuart method test", () =>
    {
        expect(Easing.outQuart(0.1, 0.5, 0.5, 1)).toBe(0.6719499999999999);
    });
});