import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ComputePipelineManager } from "../ComputePipelineManager";

/**
 * @description Compute Shaderでブラーを実行
 *              Execute blur using Compute Shader
 *
 * Fragment Shaderより並列処理に優れ、大きなブラー半径で20-35%高速化。
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {GPUCommandEncoder} commandEncoder - コマンドエンコーダー
 * @param {ComputePipelineManager} computePipelineManager - Compute Pipeline Manager
 * @param {IAttachmentObject} source - 入力アタッチメント
 * @param {IAttachmentObject} dest - 出力アタッチメント
 * @param {boolean} isHorizontal - 水平ブラーかどうか
 * @param {number} radius - ブラー半径
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    computePipelineManager: ComputePipelineManager,
    source: IAttachmentObject,
    dest: IAttachmentObject,
    isHorizontal: boolean,
    radius: number
): void => {

    const pipelineName = isHorizontal ? "blur_compute_horizontal" : "blur_compute_vertical";
    const pipeline = computePipelineManager.getPipeline(pipelineName);
    const bindGroupLayout = computePipelineManager.getBindGroupLayout("blur_compute");

    if (!pipeline || !bindGroupLayout) {
        console.error(`[WebGPU Compute] ${pipelineName} pipeline not found`);
        return;
    }

    // ガウシアンブラーのσ（標準偏差）を計算
    // σ ≈ radius / 3 で約99.7%のカバレッジ
    const sigma = Math.max(1.0, radius / 3.0);

    // パラメータバッファを作成
    const params = new Float32Array([
        isHorizontal ? 1.0 : 0.0,  // direction.x
        isHorizontal ? 0.0 : 1.0,  // direction.y
        radius,                     // radius
        sigma,                      // sigma
        source.width,              // texSize.x
        source.height,             // texSize.y
        0.0,                       // padding
        0.0                        // padding
    ]);

    const paramsBuffer = device.createBuffer({
        "size": params.byteLength,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(paramsBuffer, 0, params);

    // BindGroupを作成
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            {
                "binding": 0,
                "resource": source.texture!.view
            },
            {
                "binding": 1,
                "resource": dest.texture!.view
            },
            {
                "binding": 2,
                "resource": { "buffer": paramsBuffer }
            }
        ]
    });

    // Compute Passを開始
    const computePass = commandEncoder.beginComputePass({
        "label": `blur_compute_pass_${isHorizontal ? "h" : "v"}`
    });

    computePass.setPipeline(pipeline);
    computePass.setBindGroup(0, bindGroup);

    // ワークグループ数を計算（16x16スレッド）
    const WORKGROUP_SIZE = 16;
    const workgroupsX = Math.ceil(dest.width / WORKGROUP_SIZE);
    const workgroupsY = Math.ceil(dest.height / WORKGROUP_SIZE);

    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);
    computePass.end();
};
