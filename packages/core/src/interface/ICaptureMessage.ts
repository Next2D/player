export interface ICaptureMessage {
    command: "capture";
    buffer: Float32Array | null;
    length: number;
    imageBitmaps: ImageBitmap[] | null;
}