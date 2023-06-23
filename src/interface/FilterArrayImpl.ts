import { BlurFilter } from "../next2d/filters/BlurFilter";
import { BevelFilter } from "../next2d/filters/BevelFilter";
import { ColorMatrixFilter } from "../next2d/filters/ColorMatrixFilter";
import { ConvolutionFilter } from "../next2d/filters/ConvolutionFilter";
import { DisplacementMapFilter } from "../next2d/filters/DisplacementMapFilter";
import { DropShadowFilter } from "../next2d/filters/DropShadowFilter";
import { GlowFilter } from "../next2d/filters/GlowFilter";
import { GradientBevelFilter } from "../next2d/filters/GradientBevelFilter";
import { GradientGlowFilter } from "../next2d/filters/GradientGlowFilter";

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