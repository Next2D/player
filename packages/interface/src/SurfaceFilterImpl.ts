type ClassName = "BevelFilter"
    | "BlurFilter"
    | "ColorMatrixFilter"
    | "ConvolutionFilter"
    | "DisplacementMapFilter"
    | "DropShadowFilter"
    | "GlowFilter"
    | "GradientBevelFilter"
    | "GradientGlowFilter";

export interface SurfaceFilterImpl {
    class: ClassName;
    params: any[];
}