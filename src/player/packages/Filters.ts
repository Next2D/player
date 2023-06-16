import { BevelFilter } from "../next2d/filters/BevelFilter";
import { BlurFilter } from "../next2d/filters/BlurFilter";
import { ColorMatrixFilter } from "../next2d/filters/ColorMatrixFilter";
import { ConvolutionFilter } from "../next2d/filters/ConvolutionFilter";
import { DisplacementMapFilter } from "../next2d/filters/DisplacementMapFilter";
import { DropShadowFilter } from "../next2d/filters/DropShadowFilter";
import { GlowFilter } from "../next2d/filters/GlowFilter";
import { GradientBevelFilter } from "../next2d/filters/GradientBevelFilter";
import { GradientGlowFilter } from "../next2d/filters/GradientGlowFilter";
import type { FiltersImpl } from "../../interface/FiltersImpl";

const filters: FiltersImpl = {
    BevelFilter,
    BlurFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
};

Object.entries(filters).forEach(([key, FilterClass]) =>
{
    Object.defineProperty(filters, key, {
        get()
        {
            return FilterClass;
        }
    });
});

export { filters };