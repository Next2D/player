/**
 * @description クリアカラー値のプリアロケートオブジェクト
 *              Pre-allocated clear color value object
 * @type {GPUColorDict}
 */
const $clearValue: GPUColorDict = { "r": 0, "g": 0, "b": 0, "a": 0 };

/**
 * @description カラーアタッチメントのプリアロケートオブジェクト
 *              Pre-allocated color attachment object
 * @type {GPURenderPassColorAttachment}
 */
const $colorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "clearValue": $clearValue,
    "loadOp": "load",
    "storeOp": "store"
};

/**
 * @description 深度ステンシルアタッチメントのプリアロケートオブジェクト
 *              Pre-allocated depth stencil attachment object
 * @type {GPURenderPassDepthStencilAttachment}
 */
const $depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
    "view": null as unknown as GPUTextureView,
    "stencilClearValue": 0,
    "stencilLoadOp": "clear",
    "stencilStoreOp": "store"
};

/**
 * @description ステンシル付きレンダーパス記述子のプリアロケートオブジェクト
 *              Pre-allocated render pass descriptor with stencil
 * @type {GPURenderPassDescriptor}
 */
const $descriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$colorAttachment],
    "depthStencilAttachment": $depthStencilAttachment
};

/**
 * @description ステンシル付きレンダーパス記述子を作成（プリアロケート再利用）
 *              Create render pass descriptor with stencil (pre-allocated reuse)
 *
 * @param  {GPUTextureView} color_view - カラーアタッチメントのテクスチャビュー
 * @param  {GPUTextureView} stencil_view - ステンシルアタッチメントのテクスチャビュー
 * @param  {GPULoadOp} color_load_op - カラーのロード操作
 * @param  {GPULoadOp} stencil_load_op - ステンシルのロード操作
 * @param  {GPUTextureView | null} resolve_target - MSAAリゾルブターゲット
 * @return {GPURenderPassDescriptor}
 * @method
 * @protected
 */
export const execute = (
    color_view: GPUTextureView,
    stencil_view: GPUTextureView,
    color_load_op: GPULoadOp = "load",
    stencil_load_op: GPULoadOp = "clear",
    resolve_target: GPUTextureView | null = null
): GPURenderPassDescriptor => {
    $colorAttachment.view = color_view;
    $colorAttachment.loadOp = color_load_op;
    $colorAttachment.resolveTarget = resolve_target ?? undefined;
    $depthStencilAttachment.view = stencil_view;
    $depthStencilAttachment.stencilLoadOp = stencil_load_op;
    return $descriptor;
};
