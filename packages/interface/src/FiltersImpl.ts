import { BevelFilter } from "../../filters/src/BevelFilter";
import { BlurFilter } from "../../filters/src/BlurFilter";
import { ColorMatrixFilter } from "../../filters/src/ColorMatrixFilter";
import { ConvolutionFilter } from "../../filters/src/ConvolutionFilter";
import { DisplacementMapFilter } from "../../filters/src/DisplacementMapFilter";
import { DropShadowFilter } from "../../filters/src/DropShadowFilter";
import { GlowFilter } from "../../filters/src/GlowFilter";
import { GradientBevelFilter } from "../../filters/src/GradientBevelFilter";
import { GradientGlowFilter } from "../../filters/src/GradientGlowFilter";

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