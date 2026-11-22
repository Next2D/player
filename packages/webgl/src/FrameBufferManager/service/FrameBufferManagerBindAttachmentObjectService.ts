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
    $isFramebufferBound,
    $attachedColor,
    $setAttachedColor,
    $attachedStencil,
    $setAttachedStencil
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

    if (!$isFramebufferBound) {
        $setFramebufferBound(true);
        $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);
    }

    // 描画先の切り替えは図形ごとに起きるので、GL の呼び出しを必要な分だけにする:
    // - framebufferRenderbuffer はレンダーバッファを引数で受け取るので、bindRenderbuffer は要らない
    // - すでに同じリソースがアタッチされていれば、付け直さない
    if (attachment_object.msaa) {
        const color = (attachment_object.color as IColorBufferObject).resource;
        if ($attachedColor !== color) {
            $setAttachedColor(color);
            $gl.framebufferRenderbuffer(
                $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
                $gl.RENDERBUFFER, color
            );
        }
    } else {
        textureManagerBind0UseCase(attachment_object.texture as ITextureObject);
        const texture = (attachment_object.texture as ITextureObject).resource;
        if ($attachedColor !== texture) {
            $setAttachedColor(texture);
            $gl.framebufferTexture2D(
                $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
                $gl.TEXTURE_2D, texture, 0
            );
        }

        // テクスチャフィードバックループを防止:
        // WebGL2ではテクスチャユニットにバインドされたテクスチャが描画フレームバッファにも
        // アタッチされている場合、drawArrays等がINVALID_OPERATIONを生成する。
        // framebufferTexture2Dにはテクスチャユニットへのバインドは不要なため、アンバインドする。
        textureManagerBindService(0, $gl.TEXTURE0, null);
    }

    const stencil = (attachment_object.stencil as IStencilBufferObject).resource;
    if ($attachedStencil !== stencil) {
        $setAttachedStencil(stencil);
        $gl.framebufferRenderbuffer(
            $gl.FRAMEBUFFER, $gl.STENCIL_ATTACHMENT,
            $gl.RENDERBUFFER, stencil
        );
    }
};