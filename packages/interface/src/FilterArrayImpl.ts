import { BlurFilter } from "../../filters/src/BlurFilter";
import { BevelFilter } from "../../filters/src/BevelFilter";
import { ColorMatrixFilter } from "../../filters/src/ColorMatrixFilter";
import { ConvolutionFilter } from "../../filters/src/ConvolutionFilter";
import { DisplacementMapFilter } from "../../filters/src/DisplacementMapFilter";
import { DropShadowFilter } from "../../filters/src/DropShadowFilter";
import { GlowFilter } from "../../filters/src/GlowFilter";
import { GradientBevelFilter } from "../../filters/src/GradientBevelFilter";
import { GradientGlowFilter } from "../../filters/src/GradientGlowFilter";

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