import { BevelFilter } from "../../BevelFilter";
import { execute } from "./BevelFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("BevelFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new BevelFilter(
            4, 45, 0xffffff, 1, 0, 1, 4, 4, 1, 1, "inner"
        ));
        expect(array.length).toBe(13);
        expect(array[0]).toBe(0);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(16777215);
        expect(array[4]).toBe(1);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(1);
        expect(array[7]).toBe(4);
        expect(array[8]).toBe(4);
        expect(array[9]).toBe(1);
        expect(array[10]).toBe(1);
        expect(array[11]).toBe(1);
        expect(array[12]).toBe(0);
    });

    it("test case2", () =>
    {
        const array = execute(new BevelFilter(
            4, 45, 0xffffff, 1, 0, 1, 4, 4, 1, 1, "outer"
        ));
        expect(array.length).toBe(13);
        expect(array[0]).toBe(0);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(16777215);
        expect(array[4]).toBe(1);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(1);
        expect(array[7]).toBe(4);
        expect(array[8]).toBe(4);
        expect(array[9]).toBe(1);
        expect(array[10]).toBe(1);
        expect(array[11]).toBe(2);
        expect(array[12]).toBe(0);
    });

    it("test case3", () =>
    {
        const array = execute(new BevelFilter(
            4, 45, 0xffffff, 1, 0, 1, 4, 4, 1, 1, "full"
        ));
        expect(array.length).toBe(13);
        expect(array[0]).toBe(0);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(16777215);
        expect(array[4]).toBe(1);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(1);
        expect(array[7]).toBe(4);
        expect(array[8]).toBe(4);
        expect(array[9]).toBe(1);
        expect(array[10]).toBe(1);
        expect(array[11]).toBe(0);
        expect(array[12]).toBe(0);
    });
});