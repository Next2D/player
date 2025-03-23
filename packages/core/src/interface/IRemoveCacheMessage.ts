export interface IRemoveCacheMessage {
    command: "removeCache";
    buffer: Float32Array | null;
}