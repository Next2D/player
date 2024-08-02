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

export type FilterArrayImpl = Array<
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