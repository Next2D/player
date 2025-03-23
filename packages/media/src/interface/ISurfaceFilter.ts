type ClassName = "BevelFilter"
    | "BlurFilter"
    | "ColorMatrixFilter"
    | "ConvolutionFilter"
    | "DisplacementMapFilter"
    | "DropShadowFilter"
    | "GlowFilter"
    | "GradientBevelFilter"
    | "GradientGlowFilter";

export interface ISurfaceFilter {
    class: ClassName;
    params: any[];
}