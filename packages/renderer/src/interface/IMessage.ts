export interface IMessage {
    command: string;
    buffer: Float32Array;
    length?: number;
    imageBitmaps?: ImageBitmap[] | null;
    canvas?: OffscreenCanvas;
    id?: string;
}