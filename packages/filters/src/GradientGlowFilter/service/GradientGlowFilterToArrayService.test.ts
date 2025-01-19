import { GradientGlowFilter } from "../../GradientGlowFilter";
import { execute } from "./GradientGlowFilterToArrayService";
import { describe, expect, it } from "vitest";

describe("GradientGlowFilterToArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new GradientGlowFilter());
        expect(array.length).toBe(12);
        expect(array[0]).toBe(8);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(null);
        expect(array[4]).toBe(null);
        expect(array[5]).toBe(null);
        expect(array[6]).toBe(4);
        expect(array[7]).toBe(4);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(1);
        expect(array[10]).toBe("inner");
        expect(array[11]).toBe(false);
    });
});