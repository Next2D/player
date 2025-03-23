import { DisplacementMapFilter } from "../../DisplacementMapFilter";
import { execute } from "./DisplacementMapFilterToArrayService";
import { describe, expect, it } from "vitest";

describe("DisplacementMapFilterToArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new DisplacementMapFilter(new Uint8Array([0, 0, 0, 0])));
        expect(array.length).toBe(13);
        expect(array[0]).toBe(4);
        expect((array[1] as number[]).length).toBe(4);
        expect(array[2]).toBe(0);
        expect(array[3]).toBe(0);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(0);
        expect(array[7]).toBe(0);
        expect(array[8]).toBe(0);
        expect(array[9]).toBe(0);
        expect(array[10]).toBe("wrap");
        expect(array[11]).toBe(0);
        expect(array[12]).toBe(0);
    });
});