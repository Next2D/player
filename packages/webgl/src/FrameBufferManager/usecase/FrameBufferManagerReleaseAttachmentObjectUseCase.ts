import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute as colorBufferObjectReleaseColorBufferObjectUseCase } from "../../ColorBufferObject/usecase/ColorBufferObjectReleaseColorBufferObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as stencilBufferObjectReleaseColorBufferObjectUseCase } from "../../StencilBufferObject/service/StencilBufferObjectReleaseColorBufferObjectService";
import { $objectPool } from "../../FrameBufferManager";

/**
 * @description 各オブジェクトを再利用するためにプールを行い、アタッチメントオブジェクトは初期化してプールに戻す
 *              Pool each object for reuse, and initialize and return the attachment object to the pool
 *
 * @param  {IAttachmentObject} attachment_object
 * @param  {boolean} [release_texture=true]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    attachment_object: IAttachmentObject,
    release_texture: boolean = true
): void => {
    if (attachment_object.msaa) {
        colorBufferObjectReleaseColorBufferObjectUseCase(
            attachment_object.color as IColorBufferObject
        );
        attachment_object.color   = null;
        attachment_object.stencil = null;
    } else {
        if (release_texture) {
            textureManagerReleaseTextureObjectUseCase(
                attachment_object.texture as ITextureObject
            );
        }
        attachment_object.texture = null;
        stencilBufferObjectReleaseColorBufferObjectUseCase(
            attachment_object.stencil as IStencilBufferObject
        );
        attachment_object.stencil = null;
    }

    $objectPool.push(attachment_object);
};