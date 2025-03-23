import { Easing } from "../../Easing";
import { describe, expect, it } from "vitest";

describe("Easing.js method test", () =>
{
    it("inQuad method test", () =>
    {
        expect(Easing.inQuad(0.1, 0.5, 0.5, 1)).toBe(0.505);
    });
});