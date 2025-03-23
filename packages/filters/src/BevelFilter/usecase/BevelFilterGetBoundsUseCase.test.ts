import { BevelFilter } from "../../BevelFilter";
import { execute } from "./BevelFilterGetBoundsUseCase";
import { describe, expect, it } from "vitest";

describe("BevelFilterGetBoundsUseCase.js test", () =>
{
    it("test case1", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new BevelFilter(), bounds);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(0);
        expect(bounds[3]).toBe(0);
    });

    it("test case2", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new BevelFilter(4, 45, 0xffffff, 1, 0, 1, 4, 4, 1, 1, "outer"), bounds);

        expect(bounds[0]).toBe(-4.828427314758301);
        expect(bounds[1]).toBe(-4.828427314758301);
        expect(bounds[2]).toBe(4.828427314758301);
        expect(bounds[3]).toBe(4.828427314758301);
    });

    it("test case3", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new BevelFilter(4, 45, 0xffffff, 1, 0, 1, 10, 10, 1, 1, "full"), bounds);

        expect(bounds[0]).toBe(-7.828427314758301);
        expect(bounds[1]).toBe(-7.828427314758301);
        expect(bounds[2]).toBe(7.828427314758301);
        expect(bounds[3]).toBe(7.828427314758301);
    });
});