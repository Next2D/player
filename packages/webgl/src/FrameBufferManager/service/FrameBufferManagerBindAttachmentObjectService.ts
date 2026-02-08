import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $gl } from "../../WebGLUtil";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as textureManagerBindService } from "../../TextureManager/service/TextureManagerBindService";
import {
    $setFramebufferBound,
    $setCurrentAttachment,
    $readFrameBuffer,
    $useFramebufferBound
} from "../../FrameBufferManager";

/**
 * @description フレームバッファにアタッチメントオブジェクトをバインドする
 *              Bind the attachment object to the frame buffer
 *
 * @param  {IAttachmentObject} attachment_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (attachment_object: IAttachmentObject): void =>
{
    $setCurrentAttachment(attachment_object);

    if (!$useFramebufferBound()) {
        $setFramebufferBound(true);
        $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);
    }

    if (attachment_object.msaa) {
        $gl.bindRenderbuffer($gl.RENDERBUFFER, (attachment_object.color as IColorBufferObject).resource);
        $gl.framebufferRenderbuffer(
            $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
            $gl.RENDERBUFFER, (attachment_object.color as IColorBufferObject).resource
        );
    } else {
        textureManagerBind0UseCase(attachment_object.texture as ITextureObject);

        $gl.framebufferTexture2D(
            $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
            $gl.TEXTURE_2D, (attachment_object.texture as ITextureObject).resource, 0
        );

        // テクスチャフィードバックループを防止:
        // WebGL2ではテクスチャユニットにバインドされたテクスチャが描画フレームバッファにも
        // アタッチされている場合、drawArrays等がINVALID_OPERATIONを生成する。
        // framebufferTexture2Dにはテクスチャユニットへのバインドは不要なため、アンバインドする。
        textureManagerBindService(0, $gl.TEXTURE0, null);
    }

    $gl.bindRenderbuffer($gl.RENDERBUFFER, (attachment_object.stencil as IStencilBufferObject).resource);
    $gl.framebufferRenderbuffer(
        $gl.FRAMEBUFFER, $gl.STENCIL_ATTACHMENT,
        $gl.RENDERBUFFER, (attachment_object.stencil as IStencilBufferObject).resource
    );
};