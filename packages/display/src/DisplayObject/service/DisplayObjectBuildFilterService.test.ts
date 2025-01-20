import { execute } from "./DisplayObjectBuildFilterService";
import type { ISurfaceFilter } from "../../interface/ISurfaceFilter";
import { describe, expect, it } from "vitest";
import type {
    BevelFilter,
    BlurFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
} from "@next2d/filters";

describe("DisplayObjectBuildFilterService.js test", () =>
{
    it("execute test case1", () =>
    {
        const surfaceFilterList = [];
        const filters = execute(surfaceFilterList);
        expect(filters.length).toBe(0);
    });

    it("execute BevelFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "BevelFilter",
            "params": [null, 10, 90, 0x99ffff, 0.5, 0xffffff, 0.2, 10, 20, 2, 2, "full", true]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as BevelFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.distance).toBe(10);
        expect(filter.angle).toBe(90);
        expect(filter.highlightColor).toBe(0x99ffff);
        expect(filter.highlightAlpha).toBe(0.5);
        expect(filter.shadowColor).toBe(0xffffff);
        expect(filter.shadowAlpha).toBe(0.2);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(2);
        expect(filter.quality).toBe(2);
        expect(filter.type).toBe("full");
        expect(filter.knockout).toBe(true);
    });

    it("execute BlurFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "BlurFilter",
            "params": [null, 10, 20, 2]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as BlurFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.quality).toBe(2);
    });

    it("execute ColorMatrixFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "ColorMatrixFilter",
            "params": [null, [0.1, 0, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0, 0.4, 0]]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as ColorMatrixFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.matrix[0]).toBe(0.1);
        expect(filter.matrix[1]).toBe(0);
        expect(filter.matrix[2]).toBe(0);
        expect(filter.matrix[3]).toBe(0);
        expect(filter.matrix[4]).toBe(0);
        expect(filter.matrix[5]).toBe(0);
        expect(filter.matrix[6]).toBe(0.2);
        expect(filter.matrix[7]).toBe(0);
        expect(filter.matrix[8]).toBe(0);
        expect(filter.matrix[9]).toBe(0);
        expect(filter.matrix[10]).toBe(0);
        expect(filter.matrix[11]).toBe(0);
        expect(filter.matrix[12]).toBe(0.3);
        expect(filter.matrix[13]).toBe(0);
        expect(filter.matrix[14]).toBe(0);
        expect(filter.matrix[15]).toBe(0);
        expect(filter.matrix[16]).toBe(0);
        expect(filter.matrix[17]).toBe(0);
        expect(filter.matrix[18]).toBe(0.4);
        expect(filter.matrix[19]).toBe(0);
    });

    it("execute ConvolutionFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "ConvolutionFilter",
            "params": [null]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as ConvolutionFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.matrixX).toBe(0);
        expect(filter.matrixY).toBe(0);
        expect(filter.matrix).toBe(null);
        expect(filter.divisor).toBe(1);
        expect(filter.bias).toBe(0);
        expect(filter.preserveAlpha).toBe(true);
        expect(filter.clamp).toBe(true);
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(0);
    });

    it("execute DisplacementMapFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "DisplacementMapFilter",
            "params": [null]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as DisplacementMapFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.bitmapBuffer).toBe(null);
        expect(filter.bitmapWidth).toBe(0);
        expect(filter.bitmapHeight).toBe(0);
        expect(filter.mapPointX).toBe(0);
        expect(filter.mapPointY).toBe(0);
        expect(filter.componentX).toBe(0);
        expect(filter.componentY).toBe(0);
        expect(filter.scaleX).toBe(0);
        expect(filter.scaleY).toBe(0);
        expect(filter.mode).toBe("wrap");
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(0);
    });

    it("execute DropShadowFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "DropShadowFilter",
            "params": [null, 5, 90, 0x99ffff, 0.5, 10, 20, 2, 2, true, true, true]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as DropShadowFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.distance).toBe(5);
        expect(filter.angle).toBe(90);
        expect(filter.color).toBe(0x99ffff);
        expect(filter.alpha).toBe(0.5);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(2);
        expect(filter.quality).toBe(2);
        expect(filter.inner).toBe(true);
        expect(filter.knockout).toBe(true);
        expect(filter.hideObject).toBe(true);
    });

    it("execute GlowFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "GlowFilter",
            "params": [null, 0x99ffff, 0.5, 10, 20, 2, 2, true, true]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as GlowFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.color).toBe(0x99ffff);
        expect(filter.alpha).toBe(0.5);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(2);
        expect(filter.quality).toBe(2);
        expect(filter.inner).toBe(true);
        expect(filter.knockout).toBe(true);
    });

    it("execute GradientBevelFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "GradientBevelFilter",
            "params": [null, 10, 90, [0x99ffff], [0.5], [1], 10, 20, 2, 2, "full", true]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as GradientBevelFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.distance).toBe(10);
        expect(filter.angle).toBe(90);
        expect((filter.colors as number[])[0]).toBe(0x99ffff);
        expect((filter.alphas as number[])[0]).toBe(0.5);
        expect((filter.ratios as number[])[0]).toBe(1);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(2);
        expect(filter.quality).toBe(2);
        expect(filter.type).toBe("full");
        expect(filter.knockout).toBe(true);
    });

    it("execute GradientGlowFilter test case", () =>
    {
        const surfaceFilterList = [{
            "class": "GradientGlowFilter",
            "params": [null, 10, 90, [0x99ffff], [0.5], [1], 10, 20, 2, 2, "full", true]
        }] as ISurfaceFilter[];

        const filters = execute(surfaceFilterList) as GradientGlowFilter[];
        expect(filters.length).toBe(1);

        const filter = filters[0];
        expect(filter.distance).toBe(10);
        expect(filter.angle).toBe(90);
        expect((filter.colors as number[])[0]).toBe(0x99ffff);
        expect((filter.alphas as number[])[0]).toBe(0.5);
        expect((filter.ratios as number[])[0]).toBe(1);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(2);
        expect(filter.quality).toBe(2);
        expect(filter.type).toBe("full");
        expect(filter.knockout).toBe(true);
    });
});