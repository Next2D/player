import type {
    Matrix,
    ColorTransform
} from "@next2d/geom";

export interface ICaptureOptions {
    matrix?: Matrix | null;
    colorTransform?: ColorTransform | null;
    canvas?: HTMLCanvasElement | null;
}