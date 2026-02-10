const $clearValue: GPUColorDict = { "r": 0, "g": 0, "b": 0, "a": 0 };
const $colorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "clearValue": $clearValue,
    "loadOp": "load",
    "storeOp": "store"
};
const $depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
    "view": null as unknown as GPUTextureView,
    "stencilClearValue": 0,
    "stencilLoadOp": "clear",
    "stencilStoreOp": "store"
};
const $descriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$colorAttachment],
    "depthStencilAttachment": $depthStencilAttachment
};

/**
 * @description ステンシル付きレンダーパス記述子を作成（プリアロケート再利用）
 */
export const execute = (
    colorView: GPUTextureView,
    stencilView: GPUTextureView,
    colorLoadOp: GPULoadOp = "load",
    stencilLoadOp: GPULoadOp = "clear",
    resolveTarget: GPUTextureView | null = null
): GPURenderPassDescriptor => {
    $colorAttachment.view = colorView;
    $colorAttachment.loadOp = colorLoadOp;
    $colorAttachment.resolveTarget = resolveTarget ?? undefined;
    $depthStencilAttachment.view = stencilView;
    $depthStencilAttachment.stencilLoadOp = stencilLoadOp;
    return $descriptor;
};
