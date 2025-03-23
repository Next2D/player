import { ConvolutionFilter } from "../../ConvolutionFilter";
import { execute } from "./ConvolutionFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("ConvolutionFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new ConvolutionFilter(
            3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]
        ));
        expect(array.length).toBe(18);
        expect(array[0]).toBe(3);
        expect(array[1]).toBe(3);
        expect(array[2]).toBe(3);
        expect(array[3]).toBe(1);
        expect(array[4]).toBe(2);
        expect(array[5]).toBe(3);
        expect(array[6]).toBe(4);
        expect(array[7]).toBe(5);
        expect(array[8]).toBe(6);
        expect(array[9]).toBe(7);
        expect(array[10]).toBe(8);
        expect(array[11]).toBe(9);
        expect(array[12]).toBe(1);
        expect(array[13]).toBe(0);
        expect(array[14]).toBe(1);
        expect(array[15]).toBe(1);
        expect(array[16]).toBe(0);
        expect(array[17]).toBe(0);
    });
});