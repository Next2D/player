/**
 * @description サンプラーを初期化
 *              Initialize samplers
 *
 * @param  {GPUDevice} device
 * @param  {Map<string, GPUSampler>} samplers
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    samplers: Map<string, GPUSampler>
): void => {
    // デフォルトサンプラー（リニアフィルタリング）
    const linearSampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge"
    });
    samplers.set("linear", linearSampler);

    // ニアレストサンプラー
    const nearestSampler = device.createSampler({
        magFilter: "nearest",
        minFilter: "nearest",
        mipmapFilter: "nearest",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge"
    });
    samplers.set("nearest", nearestSampler);

    // リピートサンプラー
    const repeatSampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "linear",
        addressModeU: "repeat",
        addressModeV: "repeat"
    });
    samplers.set("repeat", repeatSampler);
};
