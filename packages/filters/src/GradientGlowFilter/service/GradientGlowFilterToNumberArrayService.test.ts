import { GradientGlowFilter } from "../../GradientGlowFilter";
import { execute } from "./GradientGlowFilterToNumberArrayService";
import { describe, expect, it } from "vitest";

describe("GradientGlowFilterToNumberArrayService.js test", () =>
{
    it("test case", () =>
    {
        const array = execute(new GradientGlowFilter());
        expect(array.length).toBe(12);
        expect(array[0]).toBe(8);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(0);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0);
        expect(array[6]).toBe(4);
        expect(array[7]).toBe(4);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(1);
        expect(array[10]).toBe(2);
        expect(array[11]).toBe(0);
    });

    it("test case2", () =>
    {
        const array = execute(new GradientGlowFilter(
            4, 45, [0, 0xffffff], [0, 1], [0, 255], 4, 4, 1, 1, "inner"
        ));
        expect(array.length).toBe(18);
        expect(array[0]).toBe(8);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(2);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0xffffff);
        expect(array[6]).toBe(2);
        expect(array[7]).toBe(0);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(2);
        expect(array[10]).toBe(0);
        expect(array[11]).toBe(255);
        expect(array[12]).toBe(4);
        expect(array[13]).toBe(4);
        expect(array[14]).toBe(1);
        expect(array[15]).toBe(1);
        expect(array[16]).toBe(1);
        expect(array[17]).toBe(0);
    });

    it("test case3", () =>
    {
        const array = execute(new GradientGlowFilter(
            4, 45, [0, 0xffffff], [0, 1], [0, 255], 4, 4, 1, 1, "outer"
        ));
        expect(array.length).toBe(18);
        expect(array[0]).toBe(8);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(2);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0xffffff);
        expect(array[6]).toBe(2);
        expect(array[7]).toBe(0);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(2);
        expect(array[10]).toBe(0);
        expect(array[11]).toBe(255);
        expect(array[12]).toBe(4);
        expect(array[13]).toBe(4);
        expect(array[14]).toBe(1);
        expect(array[15]).toBe(1);
        expect(array[16]).toBe(2);
        expect(array[17]).toBe(0);
    });

    it("test case4", () =>
    {
        const array = execute(new GradientGlowFilter(
            4, 45, [0, 0xffffff], [0, 1], [0, 255], 4, 4, 1, 1, "full"
        ));
        expect(array.length).toBe(18);
        expect(array[0]).toBe(8);
        expect(array[1]).toBe(4);
        expect(array[2]).toBe(45);
        expect(array[3]).toBe(2);
        expect(array[4]).toBe(0);
        expect(array[5]).toBe(0xffffff);
        expect(array[6]).toBe(2);
        expect(array[7]).toBe(0);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(2);
        expect(array[10]).toBe(0);
        expect(array[11]).toBe(255);
        expect(array[12]).toBe(4);
        expect(array[13]).toBe(4);
        expect(array[14]).toBe(1);
        expect(array[15]).toBe(1);
        expect(array[16]).toBe(0);
        expect(array[17]).toBe(0);
    });
});