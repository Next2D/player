import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ComputePipelineManager } from "../ComputePipelineManager";

/**
 * @description プリアロケートされたFloat32Array (サイズ8)
 */
const $params8 = new Float32Array(8);

/**
 * @description Compute Shaderでブラーを実行（ボックスブラー）
 *              Execute box blur using Compute Shader
 *
 * Fragment Shaderと同一のボックスブラーアルゴリズムを使用。
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {GPUCommandEncoder} commandEncoder - コマンドエンコーダー
 * @param {ComputePipelineManager} computePipelineManager - Compute Pipeline Manager
 * @param {IAttachmentObject} source - 入力アタッチメント
 * @param {IAttachmentObject} dest - 出力アタッチメント
 * @param {boolean} isHorizontal - 水平ブラーかどうか
 * @param {number} blur - ブラー量（bufferBlurX/Y相当）
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    computePipelineManager: ComputePipelineManager,
    source: IAttachmentObject,
    dest: IAttachmentObject,
    isHorizontal: boolean,
    blur: number
): void => {

    const pipelineName = isHorizontal ? "blur_compute_horizontal" : "blur_compute_vertical";
    const pipeline = computePipelineManager.getPipeline(pipelineName);
    const bindGroupLayout = computePipelineManager.getBindGroupLayout("blur_compute");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    // ボックスブラーパラメータ（Fragment ShaderのcalculateDirectionalBlurParamsと同一ロジック）
    const halfBlur = Math.ceil(blur * 0.5);
    const fraction = 1 - (halfBlur - blur * 0.5);
    const samples = 1 + blur;

    $params8[0] = isHorizontal ? 1.0 : 0.0;  // direction.x
    $params8[1] = isHorizontal ? 0.0 : 1.0;  // direction.y
    $params8[2] = halfBlur;                   // radius (halfBlur)
    $params8[3] = fraction;                   // fraction
    $params8[4] = source.width;               // texSize.x
    $params8[5] = source.height;              // texSize.y
    $params8[6] = samples;                    // samples
    $params8[7] = 0.0;                        // padding

    const paramsBuffer = device.createBuffer({
        "size": $params8.byteLength,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(paramsBuffer, 0, $params8);

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

    const computePass = commandEncoder.beginComputePass({
        "label": `blur_compute_pass_${isHorizontal ? "h" : "v"}`
    });

    computePass.setPipeline(pipeline);
    computePass.setBindGroup(0, bindGroup);

    const workgroupsX = Math.ceil(dest.width / 16);
    const workgroupsY = Math.ceil(dest.height / 16);

    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);
    computePass.end();
};
