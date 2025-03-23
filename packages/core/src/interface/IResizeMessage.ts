export interface IResizeMessage {
    command: "resize";
    buffer: Float32Array | null;
}