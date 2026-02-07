/**
 * @description バケットあたりの最大プールサイズ
 *              Maximum pool size per bucket
 * @type {number}
 * @const
 */
const MAX_BUCKET_SIZE: number = 8;

/**
 * @description 頂点バッファをプールに返却
 *              Release vertex buffer back to pool
 *              バケット化されたMap<number, GPUBuffer[]>にO(1)で返却
 *
 * @param  {Map<number, GPUBuffer[]>} buckets - サイズ別バケットMap
 * @param  {GPUBuffer} buffer
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    buckets: Map<number, GPUBuffer[]>,
    buffer: GPUBuffer
): void => {
    const size = buffer.size;
    let bucket = buckets.get(size);

    if (!bucket) {
        bucket = [];
        buckets.set(size, bucket);
    }

    if (bucket.length >= MAX_BUCKET_SIZE) {
        // バケットが満杯の場合、このバッファを破棄
        buffer.destroy();
        return;
    }

    bucket.push(buffer);
};
