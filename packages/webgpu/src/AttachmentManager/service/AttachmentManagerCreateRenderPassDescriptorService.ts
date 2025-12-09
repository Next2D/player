import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description レンダーパスディスクリプタを作成
 *              Create render pass descriptor
 *
 * @param  {IAttachmentObject} attachment
 * @param  {number} r
 * @param  {number} g
 * @param  {number} b
 * @param  {number} a
 * @param  {GPULoadOp} loadOp
 * @return {GPURenderPassDescriptor}
 * @method
 * @protected
 */
export const execute = (
    attachment: IAttachmentObject,
    r: number,
    g: number,
    b: number,
    a: number,
    loadOp: GPULoadOp = "clear"
): GPURenderPassDescriptor => {
    // カラーアタッチメントはcolor.viewまたはtexture.viewを使用
    const colorView = attachment.color?.view ?? attachment.texture?.view;
    if (!colorView) {
        throw new Error("No color view available for render pass");
    }

    const colorAttachment: GPURenderPassColorAttachment = {
        view: colorView,
        loadOp,
        storeOp: "store",
        clearValue: { r, g, b, a }
    };

    const descriptor: GPURenderPassDescriptor = {
        colorAttachments: [colorAttachment]
    };

    // ステンシルアタッチメントを追加
    if (attachment.stencil?.view) {
        descriptor.depthStencilAttachment = {
            view: attachment.stencil.view,
            depthLoadOp: "clear",
            depthStoreOp: "store",
            depthClearValue: 1.0,
            stencilLoadOp: "clear",
            stencilStoreOp: "store",
            stencilClearValue: 0
        };
    }

    return descriptor;
};
