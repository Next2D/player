import type { Node } from "@next2d/texture-packer";
import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as textureManagerGetTextureUseCase } from "../../TextureManager/usecase/TextureManagerGetTextureUseCase";
import { execute as frameBufferManagerTransferAtlasTextureService } from "../../FrameBufferManager/service/FrameBufferManagerTransferAtlasTextureService";
import {
    $getDrawBitmapFrameBuffer,
    $getReadBitmapFrameBuffer,
    $readFrameBuffer
} from "../../FrameBufferManager";
import { $gl } from "../../WebGLUtil";
import {
    $getActiveAtlasIndex,
    $setActiveAtlasIndex,
    $getAtlasTextureObject
} from "../../AtlasManager";

/**
 * @description アトラスフレームバッファからテクスチャを取得します。
 *              Get a texture from the atlas frame buffer.
 *
 * @param  {Node} node
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (node: Node): ITextureObject =>
{
    // 指定されたindexのフレームバッファの描画をアトラステクスチャに転送
    const activeIndex = $getActiveAtlasIndex();
    $setActiveAtlasIndex(node.index);
    frameBufferManagerTransferAtlasTextureService();

    const readBitmapFrameBuffer = $getReadBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, readBitmapFrameBuffer);

    const atlasTextureObject = $getAtlasTextureObject();
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, atlasTextureObject.resource, 0
    );

    const drawBitmapFrameBuffer = $getDrawBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, drawBitmapFrameBuffer);
    
    const textureObject = textureManagerGetTextureUseCase(node.w, node.h);
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, textureObject.resource, 0
    );

    $gl.bindFramebuffer($gl.FRAMEBUFFER, null);
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, readBitmapFrameBuffer);
    $gl.bindFramebuffer($gl.DRAW_FRAMEBUFFER, drawBitmapFrameBuffer);
    
    // execute
    $gl.blitFramebuffer(
        node.x, node.y, node.x + node.w, node.y + node.h,
        0, 0, node.w, node.h,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );

    // restore
    $setActiveAtlasIndex(activeIndex);
    $gl.bindFramebuffer($gl.READ_FRAMEBUFFER, $readFrameBuffer);
    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);

    return textureObject;
};