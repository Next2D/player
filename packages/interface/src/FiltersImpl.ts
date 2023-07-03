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

export interface FiltersImpl {
    BevelFilter: typeof BevelFilter;
    BlurFilter: typeof BlurFilter;
    ColorMatrixFilter: typeof ColorMatrixFilter;
    ConvolutionFilter: typeof ConvolutionFilter;
    DisplacementMapFilter: typeof DisplacementMapFilter;
    DropShadowFilter: typeof DropShadowFilter;
    GlowFilter: typeof GlowFilter;
    GradientBevelFilter: typeof GradientBevelFilter;
    GradientGlowFilter: typeof GradientGlowFilter;
}