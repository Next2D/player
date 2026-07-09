import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { FrameBufferManager } from "../../FrameBufferManager";

/**
 * @description MSAAテクスチャに未リゾルブの描き込みがあれば、リゾルブ専用パス
 *              (描画なし・load/store + resolveTarget)で1回だけ解決する。
 *              書き込みパスはresolveTargetを持たないため(リゾルブ遅延)、
 *              解決はリゾルブ済みテクスチャの読み手の直前に集約される。
 *              Resolve the attachment's MSAA texture once via a resolve-only
 *              pass when it has unresolved drawing. Write passes carry no
 *              resolveTarget (deferred resolve), so resolution happens only
 *              right before the resolved texture is read.
 *
 * @param  {GPUCommandEncoder} command_encoder
 * @param  {FrameBufferManager} frame_buffer_manager
 * @param  {IAttachmentObject} attachment_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    command_encoder: GPUCommandEncoder,
    frame_buffer_manager: FrameBufferManager,
    attachment_object: IAttachmentObject
): void => {

    if (!attachment_object.msaaDirty
        || !attachment_object.msaa
        || !attachment_object.msaaTexture?.view
        || !attachment_object.texture?.view
    ) {
        return ;
    }

    const renderPassDescriptor = frame_buffer_manager.createRenderPassDescriptor(
        attachment_object.msaaTexture.view,
        0, 0, 0, 0,
        "load",
        attachment_object.texture.view
    );
    command_encoder.beginRenderPass(renderPassDescriptor).end();

    attachment_object.msaaDirty = false;
};
