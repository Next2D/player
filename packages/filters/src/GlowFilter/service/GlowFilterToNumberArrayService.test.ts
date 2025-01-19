import { GlowFilter } from "../../GlowFilter";
import { execute } from "./GlowFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("GlowFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new GlowFilter());
        expect(array.length).toBe(9);
        expect(array[0]).toBe(6);
        expect(array[1]).toBe(0);
        expect(array[2]).toBe(1);
        expect(array[3]).toBe(4);
        expect(array[4]).toBe(4);
        expect(array[5]).toBe(1);
        expect(array[6]).toBe(1);
        expect(array[7]).toBe(0);
        expect(array[8]).toBe(0);
    });
});