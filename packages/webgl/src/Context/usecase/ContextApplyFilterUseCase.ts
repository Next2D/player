import type { Node } from "@next2d/texture-packer";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IBlendMode } from "../../interface/IBlendMode";
import { execute as frameBufferManagerGetTextureFromNodeUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase";
import { execute as filterApplyBlurFilterUseCase } from "../../Filter/BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as variantsBlendMatrixTextureShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService";
import { execute as shaderManagerSetMatrixTextureUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService";
import { execute as shaderManagerDrawTextureUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as filterApplyColorMatrixFilterUseCase } from "../../Filter/ColorMatrixFilter/usecase/FilterApplyColorMatrixFilterUseCase";
import { execute as filterApplyGlowFilterUseCase } from "../../Filter/GlowFilter/usecase/FilterApplyGlowFilterUseCase";
import { execute as filterApplyDropShadowFilterUseCase } from "../../Filter/DropShadowFilter/usecase/FilterApplyDropShadowFilterUseCase";
import { execute as filterApplyBevelFilterUseCase } from "../../Filter/BevelFilter/usecase/FilterApplyBevelFilterUseCase";
import { execute as filterApplyGradientBevelFilterUseCase } from "../../Filter/GradientBevelFilter/usecase/FilterApplyGradientBevelFilterUseCase";
import { execute as filterApplyGradientGlowFilterUseCase } from "../../Filter/GradientGlowFilter/usecase/FilterApplyGradientGlowFilterUseCase";
import { execute as filterApplyConvolutionFilterUseCase } from "../../Filter/ConvolutionFilter/usecase/FilterApplyConvolutionFilterUseCase";
import { execute as filterApplyDisplacementMapFilterUseCase } from "../../Filter/DisplacementMapFilter/usecase/FilterApplyDisplacementMapFilterUseCase";
import { execute as blendDrawFilterToMainUseCase } from "../../Blend/usecase/BlendDrawFilterToMainUseCase";
import { $cacheStore } from "@next2d/cache";
import { $offset } from "../../Filter";
import {
    $context,
    $getFloat32Array6,
    $getDevicePixelRatio
} from "../../WebGLUtil";

/**
 * @description フィルターを適用します。
 *              Apply the filter.
 *
 * @param  {Node} node
 * @param  {string} unique_key
 * @param  {boolean} updated
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
    updated: boolean,
    width: number,
    height: number,
    is_bitmap: boolean,
    matrix: Float32Array,
    color_transform: Float32Array,
    blend_mode: IBlendMode,
    bounds: Float32Array,
    params: Float32Array
): void => {

    const currentAttachmentObject = $context.currentAttachmentObject;

    let textureObject: ITextureObject | null = null;
    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    const key = $cacheStore.generateFilterKeys(
        matrix[0], matrix[1], matrix[2], matrix[3]
    );

    let useCache = false;
    const fKey = $cacheStore.get(unique_key, "fKey");
    if (fKey === key) {
        const cacheTextureObject = $cacheStore.get(unique_key, "fTexture") as ITextureObject;
        if (updated) {
            textureManagerReleaseTextureObjectUseCase(cacheTextureObject);
        } else {
            useCache = true;
            textureObject = cacheTextureObject;
        }
    }

    let offsetX = 0;
    let offsetY = 0;
    if (!useCache) {

        // 描画元のテクスチャを取得
        textureObject = frameBufferManagerGetTextureFromNodeUseCase(node);

        const radianX = Math.atan2(matrix[1], matrix[0]);
        const radianY = Math.atan2(-matrix[2], matrix[3]);

        const a0 = is_bitmap ? scaleX  * Math.cos(radianX) :  Math.cos(radianX);
        const b1 = is_bitmap ? scaleX  * Math.sin(radianX) :  Math.sin(radianX);
        const c2 = is_bitmap ? -scaleY * Math.sin(radianY) : -Math.sin(radianY);
        const d3 = is_bitmap ? scaleY  * Math.cos(radianY) :  Math.cos(radianY);
        const a = $getFloat32Array6(
            a0, b1, c2, d3,
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

            offsetX = tMatrix[4];
            offsetY = tMatrix[5];

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
                    {
                        const matrix_x = params[idx++];
                        const matrix_y = params[idx++];

                        const length = matrix_x * matrix_y;
                        const matrix = params.subarray(idx, idx + length);
                        idx += length;

                        textureObject = filterApplyConvolutionFilterUseCase(
                            textureObject, matrix_x, matrix_y, matrix,
                            params[idx++], params[idx++], Boolean(params[idx++]), Boolean(params[idx++]),
                            params[idx++], params[idx++]
                        );
                    }
                    break;

                case 4: // DisplacementMapFilter
                    {
                        const length = params[idx++];
                        const buffer = new Uint8Array(length);
                        buffer.set(params.subarray(idx, idx + length));
                        idx += length;

                        textureObject = filterApplyDisplacementMapFilterUseCase(
                            textureObject, matrix, buffer, params[idx++], params[idx++],
                            params[idx++], params[idx++], params[idx++], params[idx++], params[idx++], params[idx++],
                            params[idx++], params[idx++], params[idx++]
                        );
                    }
                    break;

                case 5: // DropShadowFilter
                    textureObject = filterApplyDropShadowFilterUseCase(
                        textureObject, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        Boolean(params[idx++]), Boolean(params[idx++]), Boolean(params[idx++])
                    );
                    break;

                case 6: // GlowFilter
                    textureObject = filterApplyGlowFilterUseCase(
                        textureObject, matrix,
                        params[idx++], params[idx++], params[idx++], params[idx++],
                        params[idx++], params[idx++], Boolean(params[idx++]), Boolean(params[idx++])
                    );
                    break;

                case 7: // GradientBevelFilter
                    {
                        const distance = params[idx++];
                        const angle    = params[idx++];

                        let length = params[idx++];
                        const colors = params.subarray(idx, idx + length);
                        idx += length;

                        length = params[idx++];
                        const alphas = params.subarray(idx, idx + length);
                        idx += length;

                        length = params[idx++];
                        const ratios = params.subarray(idx, idx + length);
                        idx += length;

                        textureObject = filterApplyGradientBevelFilterUseCase(
                            textureObject, matrix,
                            distance, angle, colors, alphas, ratios,
                            params[idx++], params[idx++], params[idx++],
                            params[idx++], params[idx++], Boolean(params[idx++])
                        );
                    }
                    break;

                case 8: // GradientGlowFilter
                    {
                        const distance = params[idx++];
                        const angle    = params[idx++];

                        let length = params[idx++];
                        const colors = params.subarray(idx, idx + length);
                        idx += length;

                        length = params[idx++];
                        const alphas = params.subarray(idx, idx + length);
                        idx += length;

                        length = params[idx++];
                        const ratios = params.subarray(idx, idx + length);
                        idx += length;

                        textureObject = filterApplyGradientGlowFilterUseCase(
                            textureObject, matrix,
                            distance, angle, colors, alphas, ratios,
                            params[idx++], params[idx++], params[idx++],
                            params[idx++], params[idx++], Boolean(params[idx++])
                        );
                    }
                    break;

            }
        }
    } else {
        offsetX = $cacheStore.get(unique_key, "offsetX");
        offsetY = $cacheStore.get(unique_key, "offsetY");
    }

    if (textureObject) {

        const devicePixelRatio = $getDevicePixelRatio();
        const xMin = bounds[0] * (scaleX / devicePixelRatio);
        const yMin = bounds[1] * (scaleY / devicePixelRatio);

        $context.reset();
        $context.setTransform(1, 0, 0, 1, 0, 0);
        $context.globalCompositeOperation = blend_mode;
        blendDrawFilterToMainUseCase(
            textureObject, color_transform,
            -offsetX + xMin + matrix[4],
            -offsetY + yMin + matrix[5]
        );
    }

    if (!useCache) {
        $cacheStore.set(unique_key, "fKey", key);
        $cacheStore.set(unique_key, "fTexture", textureObject);
        $cacheStore.set(unique_key, "offsetX", offsetX);
        $cacheStore.set(unique_key, "offsetY", offsetY);
    }

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }
};