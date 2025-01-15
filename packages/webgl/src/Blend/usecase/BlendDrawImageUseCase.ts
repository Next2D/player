import type { ITextureObject } from "../../interface/ITextureObject";
import { $context } from "../../WebGLUtil";
import { execute as blendOperationUseCase } from "../../Blend/usecase/BlendOperationUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsBlendMatrixTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerSetMatrixTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerGetTextureFromBoundsUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind01UseCase } from "../../TextureManager/usecase/TextureManagerBind01UseCase";
import { execute as variantsBlendDrawShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService";
import { execute as shaderManagerSetBlendUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBlendUniformService";
import { execute as shaderManagerSetBlendWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBlendWithColorTransformUniformService";
import { execute as shaderManagerSetMatrixTextureWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureWithColorTransformUniformService";
import { execute as frameBufferManagerTransferTextureFromRectService } from "../../FrameBufferManager/service/FrameBufferManagerTransferTextureFromRectService";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as blendResetService } from "../../Blend/service/BlendResetService";

/**
 * @description 指定のTextureObjectを描画します。
 *              Draw the specified TextureObject.
 *
 * @param  {ITextureObject} texture_object
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @param  {Float32Array} [color_transform=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    x: number,
    y: number,
    width: number,
    height: number,
    color_transform: Float32Array | null = null
): void => {

    const withColorTransform = color_transform === null
        ? false
        : color_transform[0] !== 1 
            || color_transform[1] !== 1 
            || color_transform[2] !== 1 
            || color_transform[3] !== 1
            || color_transform[4] !== 0
            || color_transform[5] !== 0
            || color_transform[6] !== 0
            || color_transform[7] !== 0;

    switch ($context.globalCompositeOperation) {

        case "normal":
        case "layer":
        case "add":
        case "screen":
        case "alpha":
        case "erase":
        case "copy":
            {
                textureManagerBind0UseCase(texture_object);
                blendOperationUseCase($context.globalCompositeOperation);

                const shaderManager = variantsBlendMatrixTextureShaderService(withColorTransform);

                if (withColorTransform) {
                    shaderManagerSetMatrixTextureWithColorTransformUniformService(
                        shaderManager, color_transform as Float32Array,
                        texture_object.width, texture_object.height
                    );
                } else {
                    shaderManagerSetMatrixTextureUniformService(
                        shaderManager, texture_object.width, texture_object.height
                    );
                }

                shaderManagerDrawTextureUseCase(shaderManager);
            }
            break;

        default:
            {
                const currentAttachmentObject = $context.currentAttachmentObject;

                // 書き込み先の矩形を取得
                const dstTextureObject = frameBufferManagerGetTextureFromBoundsUseCase(x, y, width, height);

                // ブレンド用のフレームバッファをバインド
                const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
                $context.bind(attachmentObject);

                // ブレンドするテクスチャをバインド
                textureManagerBind01UseCase(dstTextureObject, texture_object);

                const shaderManager = variantsBlendDrawShaderService(
                    $context.globalCompositeOperation, withColorTransform
                );

                if (withColorTransform) {
                    shaderManagerSetBlendWithColorTransformUniformService(
                        shaderManager,
                        (color_transform as Float32Array)[0],
                        (color_transform as Float32Array)[1],
                        (color_transform as Float32Array)[2],
                        (color_transform as Float32Array)[3],
                        (color_transform as Float32Array)[4],
                        (color_transform as Float32Array)[5],
                        (color_transform as Float32Array)[6],
                        (color_transform as Float32Array)[7]
                    );
                } else {
                    shaderManagerSetBlendUniformService(shaderManager);
                }

                shaderManagerDrawTextureUseCase(shaderManager);

                if (currentAttachmentObject) {
                    $context.bind(currentAttachmentObject);
                }

                // ブレンドしたtextureを元の座標に描画
                frameBufferManagerTransferTextureFromRectService(
                    x, y, attachmentObject.texture as ITextureObject
                );
                textureManagerReleaseTextureObjectUseCase(dstTextureObject);
            }
            break;

    }

    $context.reset();
    blendResetService();
};