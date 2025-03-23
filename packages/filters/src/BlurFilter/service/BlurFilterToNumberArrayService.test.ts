import { BlurFilter } from "../../BlurFilter";
import { execute } from "./BlurFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("BlurFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new BlurFilter());
        expect(array.length).toBe(4);
        expect(array[0]).toBe(1);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(4);
        expect(array[3]).toBe(1);
    });
});