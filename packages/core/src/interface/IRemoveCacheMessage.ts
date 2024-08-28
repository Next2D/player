export interface IRemoveCacheMessage {
    command: "removeClear";
    buffer: Float32Array | null;
}