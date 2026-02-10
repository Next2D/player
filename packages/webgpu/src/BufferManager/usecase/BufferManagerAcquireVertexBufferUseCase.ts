import { execute as bufferManagerUpperPowerOfTwoService } from "../service/BufferManagerUpperPowerOfTwoService";

/**
 * @description プールから頂点バッファを取得（または新規作成）
 *              Acquire vertex buffer from pool (or create new)
 *              バケット化されたMap<number, GPUBuffer[]>からO(1)で取得
 *
 * @param  {GPUDevice} device
 * @param  {Map<number, GPUBuffer[]>} buckets - サイズ別バケットMap
 * @param  {number} required_size - 必要なバイトサイズ
 * @param  {Float32Array} [data] - 初期データ
 * @return {GPUBuffer}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    buckets: Map<number, GPUBuffer[]>,
    required_size: number,
    data?: Float32Array
): GPUBuffer => {
    // 2のべき乗に切り上げてバケットキーとする
    const bucketSize = bufferManagerUpperPowerOfTwoService(required_size);

    // バケットからバッファを取得（O(1)）
    const bucket = buckets.get(bucketSize);
    let buffer: GPUBuffer;

    if (bucket && bucket.length > 0) {
        buffer = bucket.pop()!;
        // プールヒット: writeBufferで更新
        if (data) {
            device.queue.writeBuffer(buffer, 0, data.buffer, data.byteOffset, data.byteLength);
        }
    } else if (data) {
        // 新規作成 + データあり: mappedAtCreationで1コールに統合
        buffer = device.createBuffer({
            "size": bucketSize,
            "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            "mappedAtCreation": true
        });
        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
    } else {
        // 新規作成 + データなし
        buffer = device.createBuffer({
            "size": bucketSize,
            "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
    }

    return buffer;
};
