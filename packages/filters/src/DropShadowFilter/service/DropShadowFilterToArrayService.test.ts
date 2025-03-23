import { DropShadowFilter } from "../../DropShadowFilter";
import { execute } from "./DropShadowFilterToArrayService";
import { describe, expect, it } from "vitest";

describe("DropShadowFilterToArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new DropShadowFilter());
        expect(array.length).toBe(12);
        expect(array[0]).toBe(5);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(0);
        expect(array[4]).toBe(1);
        expect(array[5]).toBe(4);
        expect(array[6]).toBe(4);
        expect(array[7]).toBe(1);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(false);
        expect(array[10]).toBe(false);
        expect(array[11]).toBe(false);
    });
});