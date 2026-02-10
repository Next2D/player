/**
 * @description Indirect Bufferを作成
 *              Create Indirect Buffer for draw indirect commands
 *
 * Indirect Drawingにより、CPUからのdraw呼び出しオーバーヘッドを削減。
 * GPU側でドローコールのパラメータを決定可能。
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {number} vertex_count - 頂点数
 * @param {number} instance_count - インスタンス数
 * @param {number} first_vertex - 開始頂点インデックス
 * @param {number} first_instance - 開始インスタンスインデックス
 * @return {GPUBuffer} 作成されたIndirect Buffer
 */
export const execute = (
    device: GPUDevice,
    vertex_count: number,
    instance_count: number,
    first_vertex: number = 0,
    first_instance: number = 0
): GPUBuffer => {

    // Indirect bufferのフォーマット（非インデックス描画用）:
    // - vertexCount: u32
    // - instanceCount: u32
    // - firstVertex: u32
    // - firstInstance: u32
    // 合計16バイト

    const indirectData = new Uint32Array([
        vertex_count,
        instance_count,
        first_vertex,
        first_instance
    ]);

    const buffer = device.createBuffer({
        "size": indirectData.byteLength,
        "usage": GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
        "mappedAtCreation": true,
        "label": "indirect_buffer"
    });

    new Uint32Array(buffer.getMappedRange()).set(indirectData);
    buffer.unmap();

    return buffer;
};
