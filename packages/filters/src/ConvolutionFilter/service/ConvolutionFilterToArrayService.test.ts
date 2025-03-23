import { ConvolutionFilter } from "../../ConvolutionFilter";
import { execute } from "./ConvolutionFilterToArrayService";
import { describe, expect, it } from "vitest";

describe("ConvolutionFilterToArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new ConvolutionFilter());
        expect(array.length).toBe(10);
        expect(array[0]).toBe(3);
        expect(array[1]).toBe(0);
        expect(array[2]).toBe(0);
        expect(array[3]).toBe(null);
        expect(array[4]).toBe(1);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(true);
        expect(array[7]).toBe(true);
        expect(array[8]).toBe(0);
        expect(array[9]).toBe(0);
    });
});