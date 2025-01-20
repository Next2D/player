import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as variantsConvolutionFilterShaderService } from "../../../Shader/Variants/Filter/service/VariantsConvolutionFilterShaderService";
import { execute as shaderManagerSetConvolutionFilterUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetConvolutionFilterUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { $context } from "../../../WebGLUtil";
import {
    $intToR,
    $intToG,
    $intToB
} from "../../../Filter";

/**
 * @description コンボリューション・フィルタを適用する
 *              Apply convolution filter
 *
 * @param  {ITextureObject} texture_object
 * @param  {number} matrix_x
 * @param  {number} matrix_y
 * @param  {Float32Array} matrix
 * @param  {number} divisor
 * @param  {number} bias
 * @param  {boolean} preserve_alpha
 * @param  {boolean} clamp
 * @param  {number} color
 * @param  {number} alpha
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix_x: number = 0,
    matrix_y: number = 0,
    matrix: Float32Array,
    divisor: number = 1,
    bias: number = 0,
    preserve_alpha: boolean = true,
    clamp: boolean = true,
    color: number = 0,
    alpha: number = 0
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject;

    const width  = texture_object.width;
    const height = texture_object.height;

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(
        width, height, false
    );
    $context.bind(attachmentObject);
    $context.reset();
    $context.setTransform(1, 0, 0, 1, 0, 0);

    textureManagerBind0UseCase(texture_object, true);
    blendResetService();

    const shaderManager = variantsConvolutionFilterShaderService(
        matrix_x, matrix_y, preserve_alpha, clamp
    );

    shaderManagerSetConvolutionFilterUniformService(
        shaderManager, width, height, matrix, divisor, bias, clamp,
        $intToR(color, alpha, false),
        $intToG(color, alpha, false),
        $intToB(color, alpha, false),
        alpha
    );
    shaderManagerDrawTextureUseCase(shaderManager);

    const textureObject = attachmentObject.texture as ITextureObject;

    textureManagerReleaseTextureObjectUseCase(texture_object);
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};