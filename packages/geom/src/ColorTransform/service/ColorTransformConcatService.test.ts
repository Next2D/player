import { ColorTransform } from "../../ColorTransform";
import { describe, expect, it } from "vitest";

describe("ColorTransform.js concat test", () =>
{
    it("concat test case1", () =>
    {
        const colorTransform1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        const colorTransform2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        colorTransform1.concat(colorTransform2);

        expect(colorTransform1.redMultiplier).toBe(0.08999999612569809);
        expect(colorTransform1.greenMultiplier).toBe(0.1600000113248825);
        expect(colorTransform1.blueMultiplier).toBe(0.21000000834465027);
        expect(colorTransform1.alphaMultiplier).toBe(0.30000001192092896);
        expect(colorTransform1.redOffset).toBe(24.5);
        expect(colorTransform1.greenOffset).toBe(60);
        expect(colorTransform1.blueOffset).toBe(105);
        expect(colorTransform1.alphaOffset).toBe(150);
    });

    it("concat test case2", () =>
    {
        const colorTransform1 = new ColorTransform(100, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        const colorTransform2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        colorTransform1.concat(colorTransform2);

        expect(colorTransform1.redMultiplier).toBe(90);
        expect(colorTransform1.greenMultiplier).toBe(0.1600000113248825);
        expect(colorTransform1.blueMultiplier).toBe(0.21000000834465027);
        expect(colorTransform1.alphaMultiplier).toBe(0.30000001192092896);
        expect(colorTransform1.redOffset).toBe(-25450);
        expect(colorTransform1.greenOffset).toBe(60);
        expect(colorTransform1.blueOffset).toBe(105);
        expect(colorTransform1.alphaOffset).toBe(150);
    });

    it("concat test case3", () =>
    {
        const colorTransform1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 5000, 100, 150, 200);
        const colorTransform2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        colorTransform1.concat(colorTransform2);

        expect(colorTransform1.redMultiplier).toBe(0.08999999612569809);
        expect(colorTransform1.greenMultiplier).toBe(0.1600000113248825);
        expect(colorTransform1.blueMultiplier).toBe(0.21000000834465027);
        expect(colorTransform1.alphaMultiplier).toBe(0.30000001192092896);
        expect(colorTransform1.redOffset).toBe(4974.5);
        expect(colorTransform1.greenOffset).toBe(60);
        expect(colorTransform1.blueOffset).toBe(105);
        expect(colorTransform1.alphaOffset).toBe(150);
    });

    it("concat test case4", () =>
    {
        const colorTransform1 = new ColorTransform(0, -9, 0.3, 0.5, 50, 100, 150, 200);
        const colorTransform2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        colorTransform1.concat(colorTransform2);

        expect(colorTransform1.redMultiplier).toBe(0);
        expect(colorTransform1.greenMultiplier).toBe(-7.200000286102295);
        expect(colorTransform1.blueMultiplier).toBe(0.21000000834465027);
        expect(colorTransform1.alphaMultiplier).toBe(0.30000001192092896);
        expect(colorTransform1.redOffset).toBe(50);
        expect(colorTransform1.greenOffset).toBe(1900);
        expect(colorTransform1.blueOffset).toBe(105);
        expect(colorTransform1.alphaOffset).toBe(150);
    });
});