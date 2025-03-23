export interface IMessage {
    command: string;
    buffer: Float32Array;
    width?: number;
    height?: number;
    length?: number;
    imageBitmaps?: ImageBitmap[] | null;
    canvas?: OffscreenCanvas;
    devicePixelRatio?: number;
    id?: string;
}