export interface PropertyBitmapDataMessageImpl {
    command: string;
    sourceId: number;
    width: number;
    height: number;
    matrix?: Float32Array;
    colorTransform?: Float32Array;
}