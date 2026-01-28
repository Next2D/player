/**
 * @description レンダーパス記述子を作成
 *              Create render pass descriptor
 *
 * @param  {GPUTextureView} view - テクスチャビュー（MSAAの場合はMSAAテクスチャビュー）
 * @param  {number} r
 * @param  {number} g
 * @param  {number} b
 * @param  {number} a
 * @param  {GPULoadOp} loadOp
 * @param  {GPUTextureView | null} resolveTarget - MSAA解決先テクスチャビュー（MSAAの場合のみ）
 * @return {GPURenderPassDescriptor}
 * @method
 * @protected
 */
export const execute = (
    view: GPUTextureView,
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a: number = 0,
    loadOp: GPULoadOp = "clear",
    resolveTarget: GPUTextureView | null = null
): GPURenderPassDescriptor => {
    const colorAttachment: GPURenderPassColorAttachment = {
        "view": view,
        "clearValue": { r, g, b, a },
        "loadOp": loadOp,
        // MSAAでもstoreOpは"store"を使用（次のレンダーパスでloadするため）
        // resolveTargetが設定されている場合、resolveは自動的に実行される
        "storeOp": "store"
    };

    // MSAAの場合はresolveTargetを設定
    if (resolveTarget) {
        colorAttachment.resolveTarget = resolveTarget;
    }

    return {
        "colorAttachments": [colorAttachment]
    };
};
