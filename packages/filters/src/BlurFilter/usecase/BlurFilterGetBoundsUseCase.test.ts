import { BlurFilter } from "../../BlurFilter";
import { execute } from "./BlurFilterGetBoundsUseCase";
import { describe, expect, it } from "vitest";

describe("BlurFilterGetBoundsUseCase.js test", () =>
{
    it("test case1", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new BlurFilter(), bounds);

        expect(bounds[0]).toBe(-2);
        expect(bounds[1]).toBe(-2);
        expect(bounds[2]).toBe(2);
        expect(bounds[3]).toBe(2);
    });

    it("test case2", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new BlurFilter(30, 70, 5), bounds);

        expect(bounds[0]).toBe(-53);
        expect(bounds[1]).toBe(-123);
        expect(bounds[2]).toBe(53);
        expect(bounds[3]).toBe(123);
    });

    it("test case3", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new BlurFilter(0, 70, 5), bounds);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(0);
        expect(bounds[3]).toBe(0);
    });
});