import type { ITextureObject } from "../../interface/ITextureObject";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as textureManagerGetTextureUseCase } from "./TextureManagerGetTextureUseCase";
import { execute as textureManagerBind0UseCase } from "./TextureManagerBind0UseCase";
import {
    $context,
    $gl
} from "../../WebGLUtil";
import {
    $getDrawBitmapFrameBuffer,
    $readFrameBuffer
} from "../../FrameBufferManager";

/**
 * @type {ITextureObject}
 * @private
 */
let $mainTextureObject: ITextureObject | null = null;

/**
 * @description メインのフレームバッファから指定の範囲のテクスチャを描画して返却します。
 *              Draw and return a texture from the specified range of the main framebuffer.
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    width: number,
    height: number
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject as IAttachmentObject;

    // メインのアタッチメントオブジェクトをセット
    const mainAttachmentObject = $context.$mainAttachmentObject as IAttachmentObject;
    $context.bind(mainAttachmentObject);

    const drawBitmapFrameBuffer = $getDrawBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, drawBitmapFrameBuffer);

    // 描画先のテクスチャを更新
    if (!$mainTextureObject
        || $mainTextureObject.width !== mainAttachmentObject.width
        || $mainTextureObject.height !== mainAttachmentObject.height
    ) {
        $mainTextureObject = textureManagerGetTextureUseCase(
            mainAttachmentObject.width, mainAttachmentObject.height
        );
    }

    textureManagerBind0UseCase($mainTextureObject);
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, $mainTextureObject.resource, 0
    );

    $gl.bindFramebuffer($gl.FRAMEBUFFER, null);
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, $readFrameBuffer);
    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, drawBitmapFrameBuffer);

    $gl.enable($gl.SCISSOR_TEST);
    $gl.scissor(
        x,
        mainAttachmentObject.height - y - height,
        width + 1,
        height + 1
    );

    // execute
    $gl.blitFramebuffer(
        0, 0, mainAttachmentObject.width, mainAttachmentObject.height,
        0, 0, mainAttachmentObject.width, mainAttachmentObject.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );
    $gl.disable($gl.SCISSOR_TEST);

    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return $mainTextureObject;
};