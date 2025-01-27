import type { ITextureObject } from "../../interface/ITextureObject";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as variantsBlendTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerGetTextureUseCase } from "../../TextureManager/usecase/TextureManagerGetTextureUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";
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
    height: number
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject as IAttachmentObject;

    const drawBitmapFrameBuffer = $getDrawBitmapFrameBuffer();
    $gl.bindFramebuffer($gl.FRAMEBUFFER, drawBitmapFrameBuffer);

    if (!$mainTextureObject
        || $mainTextureObject.width !== currentAttachmentObject.width
        || $mainTextureObject.height !== currentAttachmentObject.height
    ) {
        $mainTextureObject = textureManagerGetTextureUseCase(
            currentAttachmentObject.width, currentAttachmentObject.height
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
        currentAttachmentObject.height - y - height,
        width + 1,
        height + 1
    );

    // execute
    $gl.blitFramebuffer(
        0, 0, currentAttachmentObject.width, currentAttachmentObject.height,
        0, 0, currentAttachmentObject.width, currentAttachmentObject.height,
        $gl.COLOR_BUFFER_BIT,
        $gl.NEAREST
    );
    $gl.disable($gl.SCISSOR_TEST);

    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
    $context.bind(attachmentObject);

    $context.save();
    $context.setTransform(1, 0, 0, 1, -x, -y);

    const shaderManager = variantsBlendTextureShaderService();
    shaderManagerSetTextureUniformService(
        shaderManager, $mainTextureObject.width, $mainTextureObject.height
    );

    blendResetService();
    textureManagerBind0UseCase($mainTextureObject);
    shaderManagerDrawTextureUseCase(shaderManager);

    const textureObject = attachmentObject.texture as ITextureObject;

    $context.restore();
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};