/**
 * @description Indirect Bufferを更新
 *              Update Indirect Buffer with new parameters
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {GPUBuffer} buffer - 更新するバッファ
 * @param {number} vertex_count - 頂点数
 * @param {number} instance_count - インスタンス数
 * @param {number} first_vertex - 開始頂点インデックス
 * @param {number} first_instance - 開始インスタンスインデックス
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    buffer: GPUBuffer,
    vertex_count: number,
    instance_count: number,
    first_vertex: number = 0,
    first_instance: number = 0
): void => {

    const indirectData = new Uint32Array([
        vertex_count,
        instance_count,
        first_vertex,
        first_instance
    ]);

    device.queue.writeBuffer(buffer, 0, indirectData);
};
