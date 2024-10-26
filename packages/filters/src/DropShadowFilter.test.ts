import { DropShadowFilter } from "./DropShadowFilter";
import { describe, expect, it } from "vitest";

describe("DropShadowFilter.js property test", () =>
{
    it("default test success", () =>
    {
        const dropShadowFilter = new DropShadowFilter();
        expect(dropShadowFilter.distance).toBe(4);
        expect(dropShadowFilter.angle).toBe(45);
        expect(dropShadowFilter.color).toBe(0);
        expect(dropShadowFilter.alpha).toBe(1);
        expect(dropShadowFilter.blurX).toBe(4);
        expect(dropShadowFilter.blurY).toBe(4);
        expect(dropShadowFilter.strength).toBe(1);
        expect(dropShadowFilter.quality).toBe(1);
        expect(dropShadowFilter.inner).toBe(false);
        expect(dropShadowFilter.knockout).toBe(false);
        expect(dropShadowFilter.hideObject).toBe(false);
    });
});