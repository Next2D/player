import type {
    BlurFilter,
    BevelFilter,
    ColorMatrixFilter,
    ConvolutionFilter,
    DisplacementMapFilter,
    DropShadowFilter,
    GlowFilter,
    GradientBevelFilter,
    GradientGlowFilter
} from "@next2d/filters";

export type IFilterArray = Array<
    BlurFilter
    | BevelFilter
    | ColorMatrixFilter
    | ConvolutionFilter
    | DisplacementMapFilter
    | DropShadowFilter
    | GlowFilter
    | GradientBevelFilter
    | GradientGlowFilter
>;