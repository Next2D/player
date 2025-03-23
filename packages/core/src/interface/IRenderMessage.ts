export interface IRenderMessage {
    command: "render";
    buffer: Float32Array | null;
    length: number;
    imageBitmaps: ImageBitmap[] | null;
}