import type { FiltersImpl } from "./interface/FiltersImpl";
import {
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