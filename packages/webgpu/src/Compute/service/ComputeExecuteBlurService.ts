import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ComputePipelineManager } from "../ComputePipelineManager";

/**
 * @description プリアロケートされたFloat32Array (サイズ8)
 */
const $params8 = new Float32Array(8);

/**
 * @description プリアロケートされたBindGroupEntry配列 (バインディング3つ)
 */
const $computeEntries3: GPUBindGroupEntry[] = [
    { "binding": 0, "resource": null as unknown as GPUTextureView },
    { "binding": 1, "resource": null as unknown as GPUTextureView },
    { "binding": 2, "resource": { "buffer": null as unknown as GPUBuffer } }
];

/**
 * @description プリアロケートされたComputePassDescriptor
 */
const $labelH: GPUComputePassDescriptor = { "label": "blur_compute_pass_h" };
const $labelV: GPUComputePassDescriptor = { "label": "blur_compute_pass_v" };

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
 * @param {object} [bufferManager] - バッファマネージャー（プール化用）
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    commandEncoder: GPUCommandEncoder,
    computePipelineManager: ComputePipelineManager,
    source: IAttachmentObject,
    dest: IAttachmentObject,
    isHorizontal: boolean,
    blur: number,
    bufferManager?: { acquireAndWriteUniformBuffer(data: Float32Array, byteLength?: number): GPUBuffer }
): void => {

    // radius 8～24 の場合は共有メモリ版を使用（MAX_APRON=24の制限）
    const halfBlur = Math.ceil(blur * 0.5);
    const useShared = halfBlur >= 8 && halfBlur <= 24;
    const pipelineName = useShared
        ? isHorizontal ? "blur_compute_shared_horizontal" : "blur_compute_shared_vertical"
        : isHorizontal ? "blur_compute_horizontal" : "blur_compute_vertical";
    const pipeline = computePipelineManager.getPipeline(pipelineName);
    const bindGroupLayout = computePipelineManager.getBindGroupLayout("blur_compute");

    if (!pipeline || !bindGroupLayout) {
        return;
    }

    // ボックスブラーパラメータ（Fragment ShaderのcalculateDirectionalBlurParamsと同一ロジック）
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

    const paramsBuffer = bufferManager
        ? bufferManager.acquireAndWriteUniformBuffer($params8)
        : (() => {
            const buf = device.createBuffer({
                "size": $params8.byteLength,
                "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            device.queue.writeBuffer(buf, 0, $params8);
            return buf;
        })();

    $computeEntries3[0].resource = source.texture!.view;
    $computeEntries3[1].resource = dest.texture!.view;
    ($computeEntries3[2].resource as GPUBufferBinding).buffer = paramsBuffer;
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": $computeEntries3
    });

    const computePass = commandEncoder.beginComputePass(isHorizontal ? $labelH : $labelV);

    computePass.setPipeline(pipeline);
    computePass.setBindGroup(0, bindGroup);

    const workgroupsX = Math.ceil(dest.width / 16);
    const workgroupsY = Math.ceil(dest.height / 16);

    computePass.dispatchWorkgroups(workgroupsX, workgroupsY, 1);
    computePass.end();
};
