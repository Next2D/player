import type { IPoint } from "../../interface/IPoint";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute as meshGradientStrokeGenerateUseCase } from "../../Mesh/usecase/MeshGradientStrokeGenerateUseCase";
import { generateGradientLUT, getAdaptiveResolution } from "../../Gradient/GradientLUTGenerator";
import { execute as contextComputeGradientMatrixService } from "../service/ContextComputeGradientMatrixService";

/**
 * @description グラデーション線の描画を実行
 *              Execute gradient stroke
 *
 * @param {GPUDevice} device
 * @param {GPURenderPassEncoder} renderPassEncoder
 * @param {BufferManager} bufferManager
 * @param {PipelineManager} pipelineManager
 * @param {IPoint[][]} paths - パス配列
 * @param {number} thickness - 線の太さ（半分の値）
 * @param {Float32Array} contextMatrix - コンテキストの変換行列
 * @param {Float32Array} strokeStyle - 線スタイル [r, g, b, a]
 * @param {number} type - 0: linear, 1: radial
 * @param {number[]} stops - グラデーションストップ配列 [offset, R, G, B, A, ...]
 * @param {Float32Array} gradientMatrix - グラデーション変換行列 [a, b, c, d, tx, ty]
 * @param {number} spread - スプレッドメソッド (0: pad, 1: reflect, 2: repeat)
 * @param {number} interpolation - 補間方法 (0: RGB, 1: linearRGB)
 * @param {number} focal - ラジアルグラデーションのフォーカルポイント
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {boolean} useAtlasTarget - アトラスターゲットを使用するかどうか
 * @return {void}
 */
export const execute = (
    device: GPUDevice,
    renderPassEncoder: GPURenderPassEncoder,
    bufferManager: BufferManager,
    pipelineManager: PipelineManager,
    paths: IPoint[][],
    thickness: number,
    contextMatrix: Float32Array,
    strokeStyle: Float32Array,
    type: number,
    stops: number[],
    gradientMatrix: Float32Array,
    spread: number,
    interpolation: number,
    focal: number,
    viewportWidth: number,
    viewportHeight: number,
    useAtlasTarget: boolean
): void => {
    // 色（グラデーション描画ではアルファ乗算用に使用）
    const red = strokeStyle[0];
    const green = strokeStyle[1];
    const blue = strokeStyle[2];
    const alpha = strokeStyle[3];

    // 行列を取得
    const a  = contextMatrix[0];
    const b  = contextMatrix[1];
    const c  = contextMatrix[3];
    const d  = contextMatrix[4];
    const tx = contextMatrix[6];
    const ty = contextMatrix[7];

    // グラデーションストローク用メッシュを生成
    const mesh = meshGradientStrokeGenerateUseCase(
        paths,
        thickness,
        a, b, c, d, tx, ty,
        red, green, blue, alpha,
        viewportWidth, viewportHeight
    );

    if (mesh.indexCount === 0) {
        return;
    }

    // 頂点バッファを作成
    const vertexBuffer = bufferManager.createVertexBuffer(
        `gradient_stroke_${Date.now()}`,
        mesh.buffer
    );

    // グラデーションLUTテクスチャを生成
    const lutData = generateGradientLUT(stops, spread, interpolation);
    const stopsLength = stops.length / 5;
    const lutResolution = getAdaptiveResolution(stopsLength);

    // LUTテクスチャを作成
    const lutTexture = device.createTexture({
        size: { width: lutResolution, height: 1 },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });

    // LUTデータをテクスチャに転送
    device.queue.writeTexture(
        { texture: lutTexture },
        lutData.buffer,
        { bytesPerRow: lutResolution * 4, rowsPerImage: 1, offset: lutData.byteOffset },
        { width: lutResolution, height: 1 }
    );

    // グラデーション変換行列を計算
    const computedGradientMatrix = contextComputeGradientMatrixService(gradientMatrix, type);

    // Uniformバッファを作成
    const uniformData = new Float32Array(16);
    // mat3x3 (各列がvec4にパディング)
    uniformData[0] = computedGradientMatrix[0];
    uniformData[1] = computedGradientMatrix[1];
    uniformData[2] = computedGradientMatrix[2];
    uniformData[3] = 0; // padding
    uniformData[4] = computedGradientMatrix[3];
    uniformData[5] = computedGradientMatrix[4];
    uniformData[6] = computedGradientMatrix[5];
    uniformData[7] = 0; // padding
    uniformData[8] = computedGradientMatrix[6];
    uniformData[9] = computedGradientMatrix[7];
    uniformData[10] = computedGradientMatrix[8];
    uniformData[11] = 0; // padding
    // グラデーションパラメータ
    uniformData[12] = type; // gradientType
    uniformData[13] = focal; // focal
    uniformData[14] = spread; // spread
    uniformData[15] = 0; // padding

    const uniformBuffer = bufferManager.createUniformBuffer(
        `gradient_stroke_uniform_${Date.now()}`,
        uniformData.byteLength
    );
    device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

    // サンプラーを作成
    const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge"
    });

    // バインドグループを作成
    const bindGroupLayout = pipelineManager.getBindGroupLayout("gradient_fill");
    if (!bindGroupLayout) {
        console.error("[WebGPU] gradient_fill bind group layout not found");
        lutTexture.destroy();
        return;
    }

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: lutTexture.createView() }
        ]
    });

    // パイプラインを取得（アトラス用かキャンバス用かで切り替え）
    const pipelineName = useAtlasTarget ? "gradient_fill" : "gradient_fill_bgra";
    const pipeline = pipelineManager.getPipeline(pipelineName);
    if (!pipeline) {
        console.error(`[WebGPU] ${pipelineName} pipeline not found`);
        lutTexture.destroy();
        return;
    }

    // 描画
    renderPassEncoder.setPipeline(pipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, bindGroup);
    renderPassEncoder.draw(mesh.indexCount, 1, 0, 0);
};
