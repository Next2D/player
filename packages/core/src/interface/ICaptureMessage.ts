export interface ICaptureMessage {
    command: "capture";
    buffer: Float32Array | null;
    width: number;
    height: number;
    length: number;
    imageBitmaps: ImageBitmap[] | null;
}