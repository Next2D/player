import type { Node } from "@next2d/texture-packer";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import { execute as frameBufferManagerGetTextureFromNodeUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase";
import { execute as filterApplyBlurFilterUseCase } from "../../Filter/BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsBlendMatrixTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerSetMatrixTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService";
import { execute as shaderManagerSetMatrixTextureWithColorTransformUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureWithColorTransformUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as filterApplyColorMatrixFilterUseCase } from "../../Filter/ColorMatrixFilter/usecase/FilterApplyColorMatrixFilterUseCase";
import { execute as filterApplyGlowFilterUseCase } from "../../Filter/GlowFilter/usecase/FilterApplyGlowFilterUseCase";
import { execute as filterApplyBevelFilterUseCase } from "../../Filter/BevelFilter/usecase/FilterApplyBevelFilterUseCase";
import { $cacheStore } from "@next2d/cache";
import { $offset } from "../../Filter";
import {
    $context,
    $getFloat32Array6
} from "../../WebGLUtil";

/**
 * @description フィルターを適用します。
 *              Apply the filter.
 *
 * @param  {Node} node
 * @param  {string} unique_key
 * @param  {number} width
 * @param  {number} height
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @param  {IBlendMode} blend_mode
 * @param  {Float32Array} bounds
 * @param  {Float32Array} params
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    node: Node,
    unique_key: string,
    width: number,
    height: number,
    matrix: Float32Array,
    color_transform: Float32Array,
    blend_mode: IBlendMode,
    bounds: Float32Array,
    params: Float32Array
): void => {

    const key = $cacheStore.generateFilterKeys(
        matrix[0], matrix[1], matrix[2], matrix[3]
    );

    if ($cacheStore.has(unique_key, "fKey")) {
        const fKey = $cacheStore.get(unique_key, "fKey");
        const texture = $cacheStore.get(unique_key, "fTexture");
        if (fKey === key) {
            // todo
            return ;
        }

        if (texture) {
            // todo
        }
    }

    const currentAttachmentObject = $context.currentAttachmentObject;

    // 描画元のテクスチャを取得
    let textureObject = frameBufferManagerGetTextureFromNodeUseCase(node);

    const xScale  = width  / node.w;
    const yScale  = height / node.h;
    const radianX = Math.atan2(matrix[1], matrix[0])  * xScale;
    const radianY = Math.atan2(-matrix[2], matrix[3]) * yScale;

    const a = $getFloat32Array6(
        xScale  * Math.cos(radianX),
        xScale  * Math.sin(radianX),
        -yScale * Math.sin(radianY),
        yScale  * Math.cos(radianY),
        width / 2,
        height / 2
    );

    const b = $getFloat32Array6(
        1, 0, 0, 1,
        -node.w / 2,
        -node.h / 2
    );

    const tMatrix = $getFloat32Array6(
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    );

    if (tMatrix[0] !== 1 || tMatrix[1] !== 0 || tMatrix[2] !== 0 || tMatrix[3] !== 1) {

        const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(
            width, height, false
        );

        $context.bind(attachmentObject);
        $context.reset();
        $context.setTransform(
            tMatrix[0], tMatrix[1],
            tMatrix[2], tMatrix[3],
            tMatrix[4], tMatrix[5]
        );

        textureManagerBind0UseCase(textureObject);

        // 元の描画をフィルター用のテクスチャに描画
        const shaderManager = variantsBlendMatrixTextureShaderService();
        shaderManagerSetMatrixTextureUniformService(
            shaderManager, textureObject.width, textureObject.height
        );
        shaderManagerDrawTextureUseCase(shaderManager);

        // 元のテクスチャを解放
        textureManagerReleaseTextureObjectUseCase(textureObject);

        // フィルター用のテクスチャをセットしてコピー用のAttachmentObjectをリリース
        textureObject = attachmentObject.texture as ITextureObject;
        frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

        if (currentAttachmentObject) {
            $context.bind(currentAttachmentObject);
        }
    }

    // オフセットを初期化
    $offset.x = 0;
    $offset.y = 0;

    // フィルターを適用
    for (let idx = 0; params.length > idx; ) {

        const type = params[idx++];
        switch (type) {

            case 0: // BevelFilter
                textureObject = filterApplyBevelFilterUseCase(
                    textureObject, matrix, 
                    params[idx++], params[idx++], params[idx++], params[idx++],
                    params[idx++], params[idx++], params[idx++], params[idx++],
                    params[idx++], params[idx++], params[idx++], Boolean(params[idx++])
                );
                break;

            case 1: // BlurFilter
                textureObject = filterApplyBlurFilterUseCase(
                    textureObject, matrix, params[idx++], params[idx++], params[idx++]
                );
                break;

            case 2: // ColorMatrixFilter
                textureObject = filterApplyColorMatrixFilterUseCase(
                    textureObject,
                    new Float32Array([
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++]
                    ])
                );
                break;

            case 3: // ConvolutionFilter
                break;

            case 4: // DisplacementMapFilter
                break;

            case 5: // DropShadowFilter
                break;

            case 6: // GlowFilter
                textureObject = filterApplyGlowFilterUseCase(
                    textureObject, matrix,
                    params[idx++], params[idx++], params[idx++], params[idx++],
                    params[idx++], params[idx++], Boolean(params[idx++]), Boolean(params[idx++])
                );
                break;

            case 7: // GradientBevelFilter
                break;

            case 8: // GradientGlowFilter
                break;

        }

    }

    // メインのAttachmentObjectに描画して終了
    $context.bind($context.$mainAttachmentObject as IAttachmentObject);
    textureManagerBind0UseCase(textureObject);

    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    const xMin = bounds[0] * scaleX;
    const yMin = bounds[1] * scaleY;

    $context.reset();
    // todo
    $context.globalCompositeOperation = blend_mode;
    $context.setTransform(
        1, 0, 0, 1,
        xMin + matrix[4],
        yMin + matrix[5]
    );

    const shaderManager = variantsBlendMatrixTextureShaderService(true);
    shaderManagerSetMatrixTextureWithColorTransformUniformService(
        shaderManager, color_transform,
        textureObject.width, textureObject.height
    );
    shaderManagerDrawTextureUseCase(shaderManager);

    // $cacheStore.set(unique_key, "fTexture", texture);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }
};