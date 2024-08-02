export interface ResizeMessageImpl {
    command: "resize";
    buffer: Float32Array | null;
}