import type { IRenderBundleConfig } from "../../interface/IRenderBundleConfig";

/**
 * @description Render Bundleを作成
 *              Create Render Bundle for recording static geometry
 *
 * Render Bundleは描画コマンドを記録し、再利用可能。
 * 静的なジオメトリや頻繁に再描画される要素に最適。
 *
 * @param {GPUDevice} device - WebGPU device
 * @param {IRenderBundleConfig} config - バンドル設定
 * @param {(encoder: GPURenderBundleEncoder) => void} recordCallback - 描画コマンドを記録するコールバック
 * @return {GPURenderBundle} 作成されたRender Bundle
 */
export const execute = (
    device: GPUDevice,
    config: IRenderBundleConfig,
    recordCallback: (encoder: GPURenderBundleEncoder) => void
): GPURenderBundle => {

    // Render Bundle Encoderを作成
    const descriptor: GPURenderBundleEncoderDescriptor = {
        "label": `render_bundle_${config.id}`,
        "colorFormats": config.colorFormats,
        "depthStencilFormat": config.depthStencilFormat,
        "sampleCount": config.sampleCount || 1
    };

    const encoder = device.createRenderBundleEncoder(descriptor);

    // コールバックで描画コマンドを記録
    recordCallback(encoder);

    // Render Bundleを完成
    return encoder.finish({
        "label": `render_bundle_${config.id}`
    });
};
