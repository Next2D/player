/**
 * @description Storage Buffer設定インターフェース
 *              Storage Buffer configuration interface
 */
export interface IStorageBufferConfig {
    /**
     * @description バッファサイズ（バイト）
     *              Buffer size in bytes
     */
    size: number;

    /**
     * @description 使用目的フラグ
     *              Usage flags for the buffer
     */
    usage: GPUBufferUsageFlags;

    /**
     * @description ラベル（デバッグ用）
     *              Label for debugging purposes
     */
    label?: string;
}

/**
 * @description プールされたStorage Buffer
 *              Pooled storage buffer
 */
export interface IPooledStorageBuffer {
    /**
     * @description GPUバッファ
     *              GPU buffer instance
     */
    buffer: GPUBuffer;

    /**
     * @description バッファサイズ（バイト）
     *              Buffer size in bytes
     */
    size: number;

    /**
     * @description 使用中フラグ
     *              Whether this buffer is currently in use
     */
    inUse: boolean;

    /**
     * @description 最後に使用されたフレーム番号
     *              Last frame number when this buffer was used
     */
    lastUsedFrame: number;
}
