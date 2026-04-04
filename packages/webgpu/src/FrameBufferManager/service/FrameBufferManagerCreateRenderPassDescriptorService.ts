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
    "loadOp": "clear",
    "storeOp": "store"
};

/**
 * @description レンダーパス記述子のプリアロケートオブジェクト
 *              Pre-allocated render pass descriptor object
 * @type {GPURenderPassDescriptor}
 */
const $descriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$colorAttachment]
};

/**
 * @description レンダーパス記述子を作成（プリアロケート再利用）
 *              Create render pass descriptor (pre-allocated reuse)
 *
 * @param  {GPUTextureView} view - レンダーターゲットのテクスチャビュー
 * @param  {number} r - クリアカラーの赤成分
 * @param  {number} g - クリアカラーの緑成分
 * @param  {number} b - クリアカラーの青成分
 * @param  {number} a - クリアカラーのアルファ成分
 * @param  {GPULoadOp} load_op - ロード操作
 * @param  {GPUTextureView | null} resolve_target - MSAAリゾルブターゲット
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
    load_op: GPULoadOp = "clear",
    resolve_target: GPUTextureView | null = null
): GPURenderPassDescriptor => {
    $colorAttachment.view = view;
    $clearValue.r = r;
    $clearValue.g = g;
    $clearValue.b = b;
    $clearValue.a = a;
    $colorAttachment.loadOp = load_op;
    $colorAttachment.resolveTarget = resolve_target ?? undefined;
    return $descriptor;
};
