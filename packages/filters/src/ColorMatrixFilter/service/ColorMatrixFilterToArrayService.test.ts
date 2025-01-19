import { ColorMatrixFilter } from "../../ColorMatrixFilter";
import { execute } from "./ColorMatrixFilterToArrayService";
import { describe, expect, it } from "vitest";

describe("ColorMatrixFilterToArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new ColorMatrixFilter());
        expect(array.length).toBe(2);
        expect(array[0]).toBe(2);
        expect(array[1][0]).toBe(1);
        expect(array[1][1]).toBe(0);
        expect(array[1][2]).toBe(0);
        expect(array[1][3]).toBe(0);
        expect(array[1][4]).toBe(0);
        expect(array[1][5]).toBe(0);
        expect(array[1][6]).toBe(1);
        expect(array[1][7]).toBe(0);
        expect(array[1][8]).toBe(0);
        expect(array[1][9]).toBe(0);
        expect(array[1][10]).toBe(0);
        expect(array[1][11]).toBe(0);
        expect(array[1][12]).toBe(1);
        expect(array[1][13]).toBe(0);
        expect(array[1][14]).toBe(0);
        expect(array[1][15]).toBe(0);
        expect(array[1][16]).toBe(0);
        expect(array[1][17]).toBe(0);
        expect(array[1][18]).toBe(1);
        expect(array[1][19]).toBe(0);
    });
});