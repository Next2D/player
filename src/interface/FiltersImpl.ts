import { BevelFilter } from "../next2d/filters/BevelFilter";
import { BlurFilter } from "../next2d/filters/BlurFilter";
import { ColorMatrixFilter } from "../next2d/filters/ColorMatrixFilter";
import { ConvolutionFilter } from "../next2d/filters/ConvolutionFilter";
import { DisplacementMapFilter } from "../next2d/filters/DisplacementMapFilter";
import { DropShadowFilter } from "../next2d/filters/DropShadowFilter";
import { GlowFilter } from "../next2d/filters/GlowFilter";
import { GradientBevelFilter } from "../next2d/filters/GradientBevelFilter";
import { GradientGlowFilter } from "../next2d/filters/GradientGlowFilter";

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