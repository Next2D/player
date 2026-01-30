/**
 * @description Storage Buffer設定インターフェース
 *              Storage Buffer configuration interface
 */
export interface IStorageBufferConfig {
    /**
     * @description バッファサイズ（バイト）
     */
    size: number;

    /**
     * @description 使用目的
     */
    usage: GPUBufferUsageFlags;

    /**
     * @description ラベル（デバッグ用）
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
     */
    buffer: GPUBuffer;

    /**
     * @description バッファサイズ（バイト）
     */
    size: number;

    /**
     * @description 使用中フラグ
     */
    inUse: boolean;

    /**
     * @description 最後に使用されたフレーム番号
     */
    lastUsedFrame: number;
}
