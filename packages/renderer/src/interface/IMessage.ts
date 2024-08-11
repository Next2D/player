export interface IMessage {
    command: string;
    buffer: Float32Array;
    canvas?: OffscreenCanvas;
    id?: string;
}