
import type { IAttachment } from "../../interface/IAttachment";
import { $objectPool } from "../../FrameBufferManager";
import { execute as frameBufferManagerCreateAttachmentObjectService } from "../service/FrameBufferManagerCreateAttachmentObjectService";
import { execute as colorBufferObjectGetColorBufferObjectUseCase } from "../../ColorBufferObject/usecase/ColorBufferObjectGetColorBufferObjectUseCase";
import { execute as stencilBufferObjectGetStencilBufferObjectUseCase } from "../../StencilBufferObject/usecase/StencilBufferObjectGetStencilBufferObjectUseCase";
import { execute as textureManagerGetTextureUseCase } from "../../TextureManager/usecase/TextureManagerGetTextureUseCase";

/**
 * @description FrameBufferManagerのアタッチメントオブジェクトを取得
 *              Get the attachment object of FrameBufferManager
 *
 * @param  {number} width 
 * @param  {number} height 
 * @param  {boolean} [multisample=false] 
 * @return {IAttachment}
 * @method
 * @protected
 */
export const execute = (width: number, height: number, multisample: boolean = false): IAttachment =>
{
    // キャッシュがあれば再利用する
    const attachmentObject = $objectPool.length 
        ? $objectPool.shift() as IAttachment
        : frameBufferManagerCreateAttachmentObjectService();

    // テクスチャを取得
    attachmentObject.width   = width;
    attachmentObject.height  = height;
    attachmentObject.texture = textureManagerGetTextureUseCase(width, height);

    if (multisample) {
        const colorBufferObject  = colorBufferObjectGetColorBufferObjectUseCase(width, height);
        attachmentObject.color   = colorBufferObject;
        attachmentObject.msaa    = true;
        attachmentObject.stencil = colorBufferObject.stencil;
    } else {
        attachmentObject.color   = null;
        attachmentObject.msaa    = false;
        attachmentObject.stencil = stencilBufferObjectGetStencilBufferObjectUseCase(width, height);
    }

    // reset
    attachmentObject.mask      = false;
    attachmentObject.clipLevel = 0;

    return attachmentObject;
};