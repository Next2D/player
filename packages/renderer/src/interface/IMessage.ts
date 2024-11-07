export interface IMessage {
    command: string;
    buffer: Float32Array;
    imageBitmaps?: ImageBitmap[] | null;
    canvas?: OffscreenCanvas;
    id?: string;
}