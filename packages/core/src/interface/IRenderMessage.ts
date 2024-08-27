export interface IRenderMessage {
    command: "render";
    buffer: Float32Array | null;
}