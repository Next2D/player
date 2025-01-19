import { GradientGlowFilter } from "../../GradientGlowFilter";
import { execute } from "./GradientGlowFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("GradientGlowFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new GradientGlowFilter());
        expect(array.length).toBe(12);
        expect(array[0]).toBe(8);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(0);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(4);
        expect(array[7]).toBe(4);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(1);
        expect(array[10]).toBe(0);
        expect(array[11]).toBe(0);
    });
});