import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as variantsBlendTextureShaderService } from "../../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as blendEraseService } from "../../../Blend/service/BlendEraseService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as filterApplyBlurFilterUseCase } from "../../BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as filterApplyBitmapFilterUseCase } from "../../BitmapFilter/usecase/FilterApplyBitmapFilterUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { $offset } from "../../../Filter";
import {
    $getDevicePixelRatio,
    $context
} from "../../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
const $Deg2Rad: number = Math.PI / 180;

/**
 * @description GradientBevelFilterを適用する
 *              Apply GradientBevelFilter
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @param  {number} distance
 * @param  {number} angle
 * @param  {number[]} colors
 * @param  {number[]} alphas
 * @param  {number[]} ratios
 * @param  {number} blur_x
 * @param  {number} blur_y
 * @param  {number} strength
 * @param  {number} quality
 * @param  {number} type
 * @param  {boolean} knockout
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix: Float32Array,
    distance: number = 4,
    angle: number = 45,
    colors: Float32Array,
    alphas: Float32Array,
    ratios: Float32Array,
    blur_x: number = 4,
    blur_y: number = 4,
    strength: number = 1,
    quality: number = 1,
    type: number = 0,
    knockout: boolean = false
): ITextureObject => {

    const baseWidth   = texture_object.width;
    const baseHeight  = texture_object.height;
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;

    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    const devicePixelRatio = $getDevicePixelRatio();
    const radian = angle * $Deg2Rad;
    const x = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const y = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    const currentAttachmentObject = $context.currentAttachmentObject;

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(baseWidth, baseHeight, false);
    $context.bind(attachmentObject);

    $context.reset();
    $context.setTransform(1, 0, 0, 1, 0, 0);

    textureManagerBind0UseCase(texture_object);

    const shaderManager = variantsBlendTextureShaderService();
    shaderManagerSetTextureUniformService(
        shaderManager, texture_object.width, texture_object.height
    );
    shaderManagerDrawTextureUseCase(shaderManager);

    $context.setTransform(1, 0, 0, 1, x * 2, y * 2);
    blendEraseService();
    shaderManagerSetTextureUniformService(
        shaderManager, texture_object.width, texture_object.height
    );
    shaderManagerDrawTextureUseCase(shaderManager);

    blendResetService();

    const bevelBaseTextureObject = attachmentObject.texture as ITextureObject;
    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    const blurTextureObject = filterApplyBlurFilterUseCase(
        bevelBaseTextureObject, matrix, blur_x, blur_y, quality, false
    );
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject);

    const blurWidth   = blurTextureObject.width;
    const blurHeight  = blurTextureObject.height;
    const bevelWidth  = Math.ceil(blurWidth  + Math.abs(x) * 2);
    const bevelHeight = Math.ceil(blurHeight + Math.abs(y) * 2);

    // bevel filter buffer
    let typeName = "";
    switch (type) {

        case 0:
            typeName = "full";
            break;

        case 1:
            typeName = "inner";
            break;

        case 2:
            typeName = "outer";
            break;

    }

    const isInner = typeName === "inner";
    const width   = isInner ? baseWidth  : bevelWidth;
    const height  = isInner ? baseHeight : bevelHeight;

    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const blurOffsetX = (blurWidth  - baseWidth)  / 2;
    const blurOffsetY = (blurHeight - baseHeight) / 2;

    const baseTextureX = isInner ? 0 : absX + blurOffsetX;
    const baseTextureY = isInner ? 0 : absY + blurOffsetY;
    const blurTextureX = isInner ? -blurOffsetX - x : absX - x;
    const blurTextureY = isInner ? -blurOffsetY - y : absY - y;

    const textureObject = filterApplyBitmapFilterUseCase(
        texture_object, blurTextureObject, width, height,
        baseWidth, baseHeight, baseTextureX, baseTextureY,
        blurWidth, blurHeight, blurTextureX, blurTextureY,
        false, typeName, knockout,
        strength, ratios, colors, alphas,
        0, 0, 0, 0, 0, 0, 0, 0
    );

    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    textureManagerReleaseTextureObjectUseCase(texture_object);
    textureManagerReleaseTextureObjectUseCase(blurTextureObject);

    return textureObject;
};