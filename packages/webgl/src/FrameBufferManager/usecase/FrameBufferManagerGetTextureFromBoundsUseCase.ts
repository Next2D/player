import type { ITextureObject } from "../../interface/ITextureObject";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as variantsBlendTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as textureManagerGetMainTextureFromBoundsUseCase } from "../../TextureManager/usecase/TextureManagerGetMainTextureFromBoundsUseCase";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";
import { $context } from "../../WebGLUtil";

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

    const mainTextureObject = textureManagerGetMainTextureFromBoundsUseCase(x, y, width, height);

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
    $context.bind(attachmentObject);

    $context.save();
    $context.setTransform(1, 0, 0, 1, -x, -y);

    const shaderManager = variantsBlendTextureShaderService();
    shaderManagerSetTextureUniformService(
        shaderManager, mainTextureObject.width, mainTextureObject.height
    );

    blendResetService();
    textureManagerBind0UseCase(mainTextureObject);
    shaderManagerDrawTextureUseCase(shaderManager);

    const textureObject = attachmentObject.texture as ITextureObject;

    $context.restore();
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};