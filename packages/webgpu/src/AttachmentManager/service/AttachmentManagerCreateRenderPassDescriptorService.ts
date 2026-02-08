import type { IAttachmentObject } from "../../interface/IAttachmentObject";

const $clearValue: GPUColorDict = { "r": 0, "g": 0, "b": 0, "a": 0 };
const $colorAttachment: GPURenderPassColorAttachment = {
    "view": null as unknown as GPUTextureView,
    "loadOp": "clear",
    "storeOp": "store",
    "clearValue": $clearValue
};
const $depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
    "view": null as unknown as GPUTextureView,
    "depthLoadOp": "clear",
    "depthStoreOp": "store",
    "depthClearValue": 1.0,
    "stencilLoadOp": "clear",
    "stencilStoreOp": "store",
    "stencilClearValue": 0
};
const $descriptor: GPURenderPassDescriptor = {
    "colorAttachments": [$colorAttachment]
};

/**
 * @description レンダーパスディスクリプタを作成（プリアロケート再利用）
 */
export const execute = (
    attachment: IAttachmentObject,
    r: number,
    g: number,
    b: number,
    a: number,
    loadOp: GPULoadOp = "clear"
): GPURenderPassDescriptor => {
    const colorView = attachment.color?.view ?? attachment.texture?.view;
    if (!colorView) {
        throw new Error("No color view available for render pass");
    }
    $colorAttachment.view = colorView;
    $colorAttachment.loadOp = loadOp;
    $clearValue.r = r;
    $clearValue.g = g;
    $clearValue.b = b;
    $clearValue.a = a;
    if (attachment.stencil?.view) {
        $depthStencilAttachment.view = attachment.stencil.view;
        $descriptor.depthStencilAttachment = $depthStencilAttachment;
    } else {
        $descriptor.depthStencilAttachment = undefined;
    }
    return $descriptor;
};
