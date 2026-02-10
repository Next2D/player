/**
 * @description プールされたバッファのエントリ
 *              Pooled buffer entry
 */
export interface IPooledBuffer {
    buffer: GPUBuffer;
    size: number;
}
