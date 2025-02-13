import type {
    Matrix,
    ColorTransform
} from "@next2d/geom";

export interface ICaptureOptions {
    matrix?: Matrix;
    colorTransform?: ColorTransform;
    canvas?: HTMLCanvasElement;
    videoSync?: boolean;
}