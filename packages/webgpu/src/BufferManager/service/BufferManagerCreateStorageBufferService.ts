import type { IStorageBufferConfig } from "../../interface/IStorageBufferConfig";

/**
 * @description Storage Bufferを作成
 *              Create Storage Buffer for efficient instance data
 *
 * Storage Bufferは大きなデータの動的更新に最適。
 * Vertex Bufferと比較して：
 * - より大きなサイズをサポート
 * - 動的更新が効率的
 * - Compute Shaderでも使用可能
 * - Vertex Bufferとしても使用可能（VERTEXフラグ付き）
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {IStorageBufferConfig} config - バッファ設定
 * @return {GPUBuffer} 作成されたStorage Buffer
 */
export const execute = (
    device: GPUDevice,
    config: IStorageBufferConfig
): GPUBuffer => {

    const buffer = device.createBuffer({
        "size": config.size,
        "usage": config.usage | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
        "label": config.label || "storage_buffer"
    });

    return buffer;
};
