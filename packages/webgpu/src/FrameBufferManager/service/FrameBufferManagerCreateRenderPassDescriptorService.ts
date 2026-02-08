const $clearValue: GPUColorDict = { "r": 0, "g": 0, "b": 0, "a": 0 };
const $colorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "clearValue": $clearValue,
    "loadOp": "clear",
    "storeOp": "store"
};
const $descriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$colorAttachment]
};

/**
 * @description レンダーパス記述子を作成（プリアロケート再利用）
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
    $colorAttachment.view = view;
    $clearValue.r = r;
    $clearValue.g = g;
    $clearValue.b = b;
    $clearValue.a = a;
    $colorAttachment.loadOp = loadOp;
    $colorAttachment.resolveTarget = resolveTarget ?? undefined;
    return $descriptor;
};
