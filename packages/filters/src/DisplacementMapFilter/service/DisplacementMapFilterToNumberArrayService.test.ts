import { DisplacementMapFilter } from "../../DisplacementMapFilter";
import { execute } from "./DisplacementMapFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("DisplacementMapFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new DisplacementMapFilter(
            new Uint8Array([10, 11, 12, 13])
        ));
        expect(array.length).toBe(17);
        expect(array[0]).toBe(4);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(10);
        expect(array[3]).toBe(11);
        expect(array[4]).toBe(12);
        expect(array[5]).toBe(13);
        expect(array[6]).toBe(0);
        expect(array[7]).toBe(0);
        expect(array[8]).toBe(0);
        expect(array[9]).toBe(0);
        expect(array[10]).toBe(0);
        expect(array[11]).toBe(0);
        expect(array[12]).toBe(0);
        expect(array[13]).toBe(0);
        expect(array[14]).toBe(2);
        expect(array[15]).toBe(0);
        expect(array[16]).toBe(0);
    });
});