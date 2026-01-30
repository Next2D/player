/**
 * @description Indirect Bufferを作成
 *              Create Indirect Buffer for draw indirect commands
 *
 * Indirect Drawingにより、CPUからのdraw呼び出しオーバーヘッドを削減。
 * GPU側でドローコールのパラメータを決定可能。
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {number} vertexCount - 頂点数
 * @param {number} instanceCount - インスタンス数
 * @param {number} firstVertex - 開始頂点インデックス
 * @param {number} firstInstance - 開始インスタンスインデックス
 * @return {GPUBuffer} 作成されたIndirect Buffer
 */
export const execute = (
    device: GPUDevice,
    vertexCount: number,
    instanceCount: number,
    firstVertex: number = 0,
    firstInstance: number = 0
): GPUBuffer => {

    // Indirect bufferのフォーマット（非インデックス描画用）:
    // - vertexCount: u32
    // - instanceCount: u32
    // - firstVertex: u32
    // - firstInstance: u32
    // 合計16バイト

    const indirectData = new Uint32Array([
        vertexCount,
        instanceCount,
        firstVertex,
        firstInstance
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

/**
 * @description Indirect Bufferを更新
 *              Update Indirect Buffer with new parameters
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {GPUBuffer} buffer - 更新するバッファ
 * @param {number} vertexCount - 頂点数
 * @param {number} instanceCount - インスタンス数
 * @param {number} firstVertex - 開始頂点インデックス
 * @param {number} firstInstance - 開始インスタンスインデックス
 */
export const update = (
    device: GPUDevice,
    buffer: GPUBuffer,
    vertexCount: number,
    instanceCount: number,
    firstVertex: number = 0,
    firstInstance: number = 0
): void => {

    const indirectData = new Uint32Array([
        vertexCount,
        instanceCount,
        firstVertex,
        firstInstance
    ]);

    device.queue.writeBuffer(buffer, 0, indirectData);
};
