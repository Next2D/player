/**
 * @description ステンシル付きレンダーパス記述子を作成（2パスフィルレンダリング用）
 *              Create stencil render pass descriptor for two-pass fill rendering
 *
 * @param  {GPUTextureView} colorView - カラーテクスチャビュー
 * @param  {GPUTextureView} stencilView - ステンシルテクスチャビュー
 * @param  {GPULoadOp} colorLoadOp - カラーのロードオペレーション
 * @param  {GPULoadOp} stencilLoadOp - ステンシルのロードオペレーション
 * @return {GPURenderPassDescriptor}
 * @method
 * @protected
 */
export const execute = (
    colorView: GPUTextureView,
    stencilView: GPUTextureView,
    colorLoadOp: GPULoadOp = "load",
    stencilLoadOp: GPULoadOp = "clear"
): GPURenderPassDescriptor => {
    return {
        colorAttachments: [{
            view: colorView,
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: colorLoadOp,
            storeOp: "store"
        }],
        depthStencilAttachment: {
            view: stencilView,
            stencilClearValue: 0,
            stencilLoadOp: stencilLoadOp,
            stencilStoreOp: "store"
        }
    };
};
