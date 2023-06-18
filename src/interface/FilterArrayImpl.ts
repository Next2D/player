import { BlurFilter } from "../player/next2d/filters/BlurFilter";
import { BevelFilter } from "../player/next2d/filters/BevelFilter";
import { ColorMatrixFilter } from "../player/next2d/filters/ColorMatrixFilter";
import { ConvolutionFilter } from "../player/next2d/filters/ConvolutionFilter";
import { DisplacementMapFilter } from "../player/next2d/filters/DisplacementMapFilter";
import { DropShadowFilter } from "../player/next2d/filters/DropShadowFilter";
import { GlowFilter } from "../player/next2d/filters/GlowFilter";
import { GradientBevelFilter } from "../player/next2d/filters/GradientBevelFilter";
import { GradientGlowFilter } from "../player/next2d/filters/GradientGlowFilter";

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