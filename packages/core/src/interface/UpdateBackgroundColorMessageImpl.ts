export interface UpdateBackgroundColorMessageImpl {
    command: "setBackgroundColor";
    buffer: Float32Array | null;
}