import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerGetTextureUseCase } from "../../TextureManager/usecase/TextureManagerGetTextureUseCase";
import { $gl } from "../../WebGLUtil";
import {
    $getDrawBitmapFrameBuffer,
    $readFrameBuffer
} from "../../FrameBufferManager";

/**
 * @description 現在のアタッチメントオブジェクトから指定の範囲のtextureを取得します。
 *              Get a texture from the specified range of the current attachment object.
 *
 * @param  {number} x 
 * @param  {number} y 
 * @param  {number} width 
 * @param  {number} height 
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    width: number,
    height: number,
): ITextureObject => {
    
    const drawBitmapFrameBuffer = $getDrawBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, drawBitmapFrameBuffer);

    const textureObject = textureManagerGetTextureUseCase(width, height);
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, textureObject.resource, 0
    );

    $gl.bindFramebuffer($gl.FRAMEBUFFER, null);
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, $readFrameBuffer);
    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, drawBitmapFrameBuffer);
    
    // execute
    $gl.blitFramebuffer(
        x, y, x + width, y + height,
        0, 0, width, height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    // 元に戻す
    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);

    return textureObject;
};