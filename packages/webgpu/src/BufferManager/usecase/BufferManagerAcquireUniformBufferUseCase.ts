/**
 * @description プールからユニフォームバッファを取得（または新規作成）
 *              Acquire uniform buffer from pool (or create new)
 *              バケット化されたMap<number, GPUBuffer[]>からO(1)で取得
 *
 * @param  {GPUDevice} device
 * @param  {Map<number, GPUBuffer[]>} buckets - サイズ別バケットMap
 * @param  {number} required_size - 必要なバイトサイズ
 * @return {GPUBuffer}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    buckets: Map<number, GPUBuffer[]>,
    required_size: number
): GPUBuffer => {
    // 16バイトアライメント
    const alignedSize = Math.ceil(required_size / 16) * 16;

    // バケットからバッファを取得（O(1)）
    const bucket = buckets.get(alignedSize);

    if (bucket && bucket.length > 0) {
        return bucket.pop()!;
    }

    // 新規作成
    return device.createBuffer({
        "size": alignedSize,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
};
