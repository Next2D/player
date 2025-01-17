import type { ITextureObject } from "../../../interface/ITextureObject";
import { $context } from "../../../WebGLUtil";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as variantsColorMatrixFilterShaderService } from "../../../Shader/Variants/Filter/service/VariantsColorMatrixFilterShaderService";
import { execute as shaderManagerSetColorMatrixFilterUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetColorMatrixFilterUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";

/**
 * @description カラーマトリックスフィルターを適用します。
 *              Apply the color matrix filter.
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (texture_object: ITextureObject, matrix: Float32Array): ITextureObject =>
{
    const currentAttachmentObject = $context.currentAttachmentObject;

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(
        texture_object.width, texture_object.height, false
    );
    $context.bind(attachmentObject);
    $context.reset();

    textureManagerBind0UseCase(texture_object, true);
    blendResetService();

    const shaderManager = variantsColorMatrixFilterShaderService();
    shaderManagerSetColorMatrixFilterUniformService(shaderManager, matrix);
    shaderManagerDrawTextureUseCase(shaderManager);

    const textureObject = attachmentObject.texture as ITextureObject;

    textureManagerReleaseTextureObjectUseCase(texture_object);
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};