import { ColorMatrixFilter } from "../../ColorMatrixFilter";
import { execute } from "./ColorMatrixFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("ColorMatrixFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new ColorMatrixFilter());
        expect(array.length).toBe(21);
        expect(array[0]).toBe(2);
        expect(array[1]).toBe(1);
        expect(array[2]).toBe(0);
        expect(array[3]).toBe(0);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(0);
        expect(array[7]).toBe(1);
        expect(array[8]).toBe(0);
        expect(array[9]).toBe(0);
        expect(array[10]).toBe(0);
        expect(array[11]).toBe(0);
        expect(array[12]).toBe(0);
        expect(array[13]).toBe(1);
        expect(array[14]).toBe(0);
        expect(array[15]).toBe(0);
        expect(array[16]).toBe(0);
        expect(array[17]).toBe(0);
        expect(array[18]).toBe(0);
        expect(array[19]).toBe(1);
        expect(array[20]).toBe(0);
    });
});