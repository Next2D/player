
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
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
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (width: number, height: number, multisample: boolean = false): IAttachmentObject =>
{
    // キャッシュがあれば再利用する
    const attachmentObject = $objectPool.length 
        ? $objectPool.shift() as IAttachmentObject
        : frameBufferManagerCreateAttachmentObjectService();

    // テクスチャを取得
    attachmentObject.width   = width;
    attachmentObject.height  = height;
    attachmentObject.texture = textureManagerGetTextureUseCase(width, height);

    if (multisample) {
        attachmentObject.msaa    = true;
        const colorBufferObject  = colorBufferObjectGetColorBufferObjectUseCase(width, height);
        attachmentObject.color   = colorBufferObject;
        attachmentObject.stencil = colorBufferObject.stencil;
    } else {
        attachmentObject.msaa    = false;
        attachmentObject.color   = null;
        attachmentObject.stencil = stencilBufferObjectGetStencilBufferObjectUseCase(width, height);
    }

    // reset
    attachmentObject.mask      = false;
    attachmentObject.clipLevel = 0;

    return attachmentObject;
};