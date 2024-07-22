import { ColorTransform } from "../../ColorTransform";
import { describe, expect, it } from "vitest";

describe("ColorTransform.js concat test", () =>
{
    it("concat test case1", () =>
    {
        const ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24.5, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat test case2", () =>
    {
        const ct1 = new ColorTransform(100, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=90, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=-25450, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );
    });

    it("concat test case3", () =>
    {
        const ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 5000, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=4974.5, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );
    });

    it("concat test case4", () =>
    {
        const ct1 = new ColorTransform(0, -9, 0.3, 0.5, 50, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=-7.200000286102295, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=50, greenOffset=1900, blueOffset=105, alphaOffset=150)"
        );
    });
});