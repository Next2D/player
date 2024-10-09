import { execute } from "./DisplayObjectCalcBoundsMatrixService";
import { describe, expect, it } from "vitest";

describe("DisplayObjectCalcBoundsMatrixService.js test", () =>
{
    it("execute test case1", () =>
    {
        const bounds = execute(-10, -20, 100, 200, new Float32Array([1, 0, 0, 1, 0, 0]));
        expect(bounds[0]).toBe(-10);
        expect(bounds[1]).toBe(-20);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(200);
    });

    it("execute test case2", () =>
    {
        const bounds = execute(-10, -20, 100, 200, new Float32Array([1.2, 0.34, -0.023, 0.3, 20, 40]));
        expect(bounds[0]).toBe(3.399999514222145);
        expect(bounds[1]).toBe(30.599999725818634);
        expect(bounds[2]).toBe(140.46000476926565);
        expect(bounds[3]).toBe(134.00000274181366);
    });
});