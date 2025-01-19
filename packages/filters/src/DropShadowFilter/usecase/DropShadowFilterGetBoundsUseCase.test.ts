import { DropShadowFilter } from "../../DropShadowFilter";
import { execute } from "./DropShadowFilterGetBoundsUseCase";
import { describe, expect, it } from "vitest";

describe("DropShadowFilterGetBoundsUseCase.js test", () =>
{
    it("test case1", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new DropShadowFilter(), bounds);

        expect(bounds[0]).toBe(-2);
        expect(bounds[1]).toBe(-2);
        expect(bounds[2]).toBe(4.828427314758301);
        expect(bounds[3]).toBe(4.828427314758301);
    });
});