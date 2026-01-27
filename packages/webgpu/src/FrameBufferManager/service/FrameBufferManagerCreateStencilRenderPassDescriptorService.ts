/**
 * @description ステンシル付きレンダーパス記述子を作成（2パスフィルレンダリング用）
 *              Create stencil render pass descriptor for two-pass fill rendering
 *
 * @param  {GPUTextureView} colorView - カラーテクスチャビュー（MSAAの場合はMSAAテクスチャビュー）
 * @param  {GPUTextureView} stencilView - ステンシルテクスチャビュー（MSAAの場合はMSAAステンシルビュー）
 * @param  {GPULoadOp} colorLoadOp - カラーのロードオペレーション
 * @param  {GPULoadOp} stencilLoadOp - ステンシルのロードオペレーション
 * @param  {GPUTextureView | null} resolveTarget - MSAA解決先テクスチャビュー（MSAAの場合のみ）
 * @return {GPURenderPassDescriptor}
 * @method
 * @protected
 */
export const execute = (
    colorView: GPUTextureView,
    stencilView: GPUTextureView,
    colorLoadOp: GPULoadOp = "load",
    stencilLoadOp: GPULoadOp = "clear",
    resolveTarget: GPUTextureView | null = null
): GPURenderPassDescriptor => {
    const colorAttachment: GPURenderPassColorAttachment = {
        view: colorView,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: colorLoadOp,
        // MSAAでもstoreOpは"store"を使用（次のレンダーパスでloadするため）
        // resolveTargetが設定されている場合、resolveは自動的に実行される
        storeOp: "store"
    };

    // MSAAの場合はresolveTargetを設定
    if (resolveTarget) {
        colorAttachment.resolveTarget = resolveTarget;
    }

    return {
        colorAttachments: [colorAttachment],
        depthStencilAttachment: {
            view: stencilView,
            stencilClearValue: 0,
            stencilLoadOp: stencilLoadOp,
            stencilStoreOp: "store"
        }
    };
};
