import { ColorTransform } from "./ColorTransform";
import { describe, expect, it } from "vitest";

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