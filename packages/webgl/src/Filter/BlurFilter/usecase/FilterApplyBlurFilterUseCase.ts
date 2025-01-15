import type { ITextureObject } from "../../../interface/ITextureObject";
import type { IAttachmentObject } from "../../../interface/IAttachmentObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as variantsBlendMatrixTextureShaderService } from "../../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerSetMatrixTextureUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as filterApplyDirectionalBlurFilterUseCase } from "../../../Filter/BlurFilter/usecase/FilterApplyDirectionalBlurFilterUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { $offset } from "../../../Filter";
import {
    $context,
    $getDevicePixelRatio
} from "../../../WebGLUtil";

/**
 * @type {number[]}
 * @constant
 */
const $STEP: number[] = [0.5, 1.05, 1.4, 1.55, 1.75, 1.9, 2, 2.15, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];

/**
 * @description ぼかしフィルターを適用します。
 *              Apply the blur filter.
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @param  {number} [blur_x=4]
 * @param  {number} [blur_y=4]
 * @param  {number} [quality=1]
 * @param  {boolean} [removed=false]
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix: Float32Array,
    blur_x: number = 4,
    blur_y: number = 4,
    quality: number = 1,
    removed: boolean = true
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject;
    blendOneZeroService();

    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    const devicePixelRatio = $getDevicePixelRatio();
    const baseBlurX = blur_x * (xScale / devicePixelRatio * 2);
    const baseBlurY = blur_y * (yScale / devicePixelRatio * 2);

    const step = $STEP[quality - 1];
    const dx = Math.round(baseBlurX * step);
    const dy = Math.round(baseBlurY * step);

    $offset.x += dx;
    $offset.y += dy;

    const width  = texture_object.width  + dx * 2;
    const height = texture_object.height + dy * 2;

    let bufferScaleX = 1;
    let bufferScaleY = 1;

    if (baseBlurX > 128) {
        bufferScaleX = 0.0625;
    } else if (baseBlurX > 64) {
        bufferScaleX = 0.125;
    } else if (baseBlurX > 32) {
        bufferScaleX = 0.25;
    } else if (baseBlurX > 16) {
        bufferScaleX = 0.5;
    }

    if (baseBlurY > 128) {
        bufferScaleY = 0.0625;
    } else if (baseBlurY > 64) {
        bufferScaleY = 0.125;
    } else if (baseBlurY > 32) {
        bufferScaleY = 0.25;
    } else if (baseBlurY > 16) {
        bufferScaleY = 0.5;
    }

    const bufferWidth  = Math.ceil(width  * bufferScaleX);
    const bufferHeight = Math.ceil(height * bufferScaleY);

    const attachmentObject0 = frameBufferManagerGetAttachmentObjectUseCase(bufferWidth, bufferHeight, false);
    const attachmentObject1 = frameBufferManagerGetAttachmentObjectUseCase(bufferWidth, bufferHeight, false);

    const attachments: IAttachmentObject[] = [attachmentObject0, attachmentObject1];

    // 描画元のテクスチャをattachmentObject0に描画
    $context.bind(attachmentObject0);
    $context.reset();
    $context.setTransform(
        bufferScaleX, 0, 0, bufferScaleY,
        dx * bufferScaleX,
        dy * bufferScaleY
    );
    textureManagerBind0UseCase(texture_object);

    const shaderManager = variantsBlendMatrixTextureShaderService();
    shaderManagerSetMatrixTextureUniformService(
        shaderManager, texture_object.width, texture_object.height
    );
    shaderManagerDrawTextureUseCase(shaderManager);

    // 描画元のテクスチャを解放
    if (removed) {
        textureManagerReleaseTextureObjectUseCase(texture_object);
    }

    const bufferBlurX = baseBlurX * bufferScaleX;
    const bufferBlurY = baseBlurY * bufferScaleY;

    let attachmentIndex = 0;
    let textureObject = attachmentObject0.texture as ITextureObject;
    textureManagerBind0UseCase(textureObject);

    for (let q = 0; q < quality; ++q) {

        if (blur_x > 0) {
            attachmentIndex = (attachmentIndex + 1) % 2;

            const attachmentObject = attachments[attachmentIndex];
            if (attachmentObject.stencil && !attachmentObject.stencil.dirty) {
                attachmentObject.stencil.dirty = true;
            }
            $context.bind(attachmentObject);

            filterApplyDirectionalBlurFilterUseCase(
                textureObject, true, bufferBlurX
            );

            textureObject = attachmentObject.texture as ITextureObject;
        }

        if (blur_y > 0) {
            attachmentIndex = (attachmentIndex + 1) % 2;

            const attachmentObject = attachments[attachmentIndex];
            if (attachmentObject.stencil && !attachmentObject.stencil.dirty) {
                attachmentObject.stencil.dirty = true;
            }
            $context.bind(attachmentObject);

            filterApplyDirectionalBlurFilterUseCase(
                textureObject, false, bufferBlurY
            );

            textureObject = attachmentObject.texture as ITextureObject;
        }
    }

    if (bufferScaleX !== 1 || bufferScaleY !== 1) {

        const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
        $context.bind(attachmentObject);

        $context.setTransform(
            1 / bufferScaleX, 0, 0, 1 / bufferScaleY, 0, 0
        );

        textureManagerBind0UseCase(textureObject);

        shaderManagerSetMatrixTextureUniformService(
            shaderManager, textureObject.width, textureObject.height
        );
        shaderManagerDrawTextureUseCase(shaderManager);

        textureObject = attachmentObject.texture as ITextureObject;

        frameBufferManagerReleaseAttachmentObjectUseCase(attachments[0]);
        frameBufferManagerReleaseAttachmentObjectUseCase(attachments[1]);
        frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);
    } else {
        attachmentIndex = (attachmentIndex + 1) % 2;
        frameBufferManagerReleaseAttachmentObjectUseCase(attachments[attachmentIndex]);

        attachmentIndex = (attachmentIndex + 1) % 2;
        frameBufferManagerReleaseAttachmentObjectUseCase(attachments[attachmentIndex], false);
    }

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};