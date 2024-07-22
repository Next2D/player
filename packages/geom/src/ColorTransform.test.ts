import { ColorTransform } from "./ColorTransform";
import { describe, expect, it } from "vitest";

describe("ColorTransform.js toString test", () =>
{
    it("toString test case1", () =>
    {
        const colorTransform = new ColorTransform();
        expect(colorTransform.toString()).toBe("(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)");
    });

    it("toString test case2", () =>
    {
        const colorTransform = new ColorTransform(2, 3, 4, 5, 6, 7, 8, 9);
        expect(colorTransform.toString()).toBe("(redMultiplier=2, greenMultiplier=3, blueMultiplier=4, alphaMultiplier=5, redOffset=6, greenOffset=7, blueOffset=8, alphaOffset=9)");
    });
});

describe("ColorTransform.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(ColorTransform.toString()).toBe("[class ColorTransform]");
    });
});

describe("ColorTransform.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const colorTransform = new ColorTransform();
        expect(colorTransform.namespace).toBe("next2d.geom.ColorTransform");
    });

    it("namespace test static", () =>
    {
        expect(ColorTransform.namespace).toBe("next2d.geom.ColorTransform");
    });
});

describe("ColorTransform.js property test", () =>
{
    it("test case1", () => {

        const colorTransform = new ColorTransform(0.1, 0.2, 0.3, 0.4, 1, 2, 3, 4);

        expect(colorTransform.redMultiplier).toBe(0.10000000149011612);
        expect(colorTransform.greenMultiplier).toBe(0.20000000298023224);
        expect(colorTransform.blueMultiplier).toBe(0.30000001192092896);
        expect(colorTransform.alphaMultiplier).toBe(0.4000000059604645);
        expect(colorTransform.redOffset).toBe(1);
        expect(colorTransform.greenOffset).toBe(2);
        expect(colorTransform.blueOffset).toBe(3);
        expect(colorTransform.alphaOffset).toBe(4);
    });
});