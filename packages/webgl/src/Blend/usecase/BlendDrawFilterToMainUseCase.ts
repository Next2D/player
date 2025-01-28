import type { ITextureObject } from "../../interface/ITextureObject";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { $context } from "../../WebGLUtil";
import { execute as blendOperationUseCase } from "./BlendOperationUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsBlendMatrixTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerGetTextureFromBoundsUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind01UseCase } from "../../TextureManager/usecase/TextureManagerBind01UseCase";
import { execute as variantsBlendDrawShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendDrawShaderService";
import { execute as shaderManagerSetBlendWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBlendWithColorTransformUniformService";
import { execute as shaderManagerSetMatrixTextureWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureWithColorTransformUniformService";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as blendResetService } from "../service/BlendResetService";
import { execute as frameBufferManagerTransferTextureFromRectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerTransferTextureFromRectUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";

/**
 * @description 指定のTextureObjectを描画します。
 *              Draw the specified TextureObject.
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} color_transform
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    color_transform: Float32Array,
    x: number,
    y: number
): void => {

    const currentAttachmentObject = $context.currentAttachmentObject;

    const width  = texture_object.width;
    const height = texture_object.height;
    switch ($context.globalCompositeOperation) {

        case "normal":
        case "layer":
        case "add":
        case "screen":
        case "alpha":
        case "erase":
        case "copy":
            {
                // メインのAttachmentObjectに描画して終了
                $context.bind($context.$mainAttachmentObject as IAttachmentObject);
                $context.setTransform(1, 0, 0, 1, x, y);

                const shaderManager = variantsBlendMatrixTextureShaderService(true);
                shaderManagerSetMatrixTextureWithColorTransformUniformService(
                    shaderManager, color_transform, width, height
                );

                // テクスチャをバインド
                textureManagerBind0UseCase(texture_object);

                blendOperationUseCase($context.globalCompositeOperation);
                shaderManagerDrawTextureUseCase(shaderManager);
            }
            break;

        default:
            {
                // 書き込み先の矩形を取得
                const dstTextureObject = frameBufferManagerGetTextureFromBoundsUseCase(x, y, width, height);

                // ブレンド用のフレームバッファをバインド
                const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
                $context.bind(attachmentObject);

                // ブレンドするテクスチャをバインド
                textureManagerBind01UseCase(dstTextureObject, texture_object);

                const shaderManager = variantsBlendDrawShaderService(
                    $context.globalCompositeOperation, true
                );

                shaderManagerSetBlendWithColorTransformUniformService(
                    shaderManager,
                    color_transform[0], color_transform[1], color_transform[2], color_transform[3],
                    color_transform[4], color_transform[5], color_transform[6], color_transform[7]
                );

                shaderManagerDrawTextureUseCase(shaderManager);

                // メインのAttachmentObjectに描画して終了
                $context.bind($context.$mainAttachmentObject as IAttachmentObject);
                $context.reset();
                $context.setTransform(1, 0, 0, 1, x, y);

                // ブレンドしたtextureを元の座標に描画
                frameBufferManagerTransferTextureFromRectUseCase(
                    attachmentObject.texture as ITextureObject
                );

                textureManagerReleaseTextureObjectUseCase(dstTextureObject);
                frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject);
            }
            break;

    }

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    blendResetService();
};