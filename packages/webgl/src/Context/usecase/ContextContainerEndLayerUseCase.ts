import type { IBlendMode } from "../../interface/IBlendMode";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import { $containerLayerStack } from "./ContextContainerBeginLayerUseCase";
import { execute as frameBufferManagerGetTextureFromBoundsUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as blendDrawFilterToMainUseCase } from "../../Blend/usecase/BlendDrawFilterToMainUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as filterApplyBlurFilterUseCase } from "../../Filter/BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as filterApplyBevelFilterUseCase } from "../../Filter/BevelFilter/usecase/FilterApplyBevelFilterUseCase";
import { execute as filterApplyColorMatrixFilterUseCase } from "../../Filter/ColorMatrixFilter/usecase/FilterApplyColorMatrixFilterUseCase";
import { execute as filterApplyConvolutionFilterUseCase } from "../../Filter/ConvolutionFilter/usecase/FilterApplyConvolutionFilterUseCase";
import { execute as filterApplyDisplacementMapFilterUseCase } from "../../Filter/DisplacementMapFilter/usecase/FilterApplyDisplacementMapFilterUseCase";
import { execute as filterApplyDropShadowFilterUseCase } from "../../Filter/DropShadowFilter/usecase/FilterApplyDropShadowFilterUseCase";
import { execute as filterApplyGlowFilterUseCase } from "../../Filter/GlowFilter/usecase/FilterApplyGlowFilterUseCase";
import { execute as filterApplyGradientBevelFilterUseCase } from "../../Filter/GradientBevelFilter/usecase/FilterApplyGradientBevelFilterUseCase";
import { execute as filterApplyGradientGlowFilterUseCase } from "../../Filter/GradientGlowFilter/usecase/FilterApplyGradientGlowFilterUseCase";
import { $offset } from "../../Filter";
import { $cacheStore } from "@next2d/cache";
import {
    $context,
    $getDevicePixelRatio
} from "../../WebGLUtil";

/**
 * @description ColorMatrixFilter用の再利用可能なバッファ
 *              Reusable buffer for ColorMatrixFilter
 *
 * @type {Float32Array}
 * @private
 */
const $colorMatrixBuffer: Float32Array = new Float32Array(20);

/**
 * @description コンテナに対する恒等カラートランスフォーム
 *              Identity color transform for container (children already have merged CT)
 *
 * @type {Float32Array}
 * @private
 */
const $identityColorTransform: Float32Array = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @description コンテナのフィルター/ブレンド用レイヤーを終了し、結果を元のメインに合成します。
 *              End the container layer and composite the result back to the original main.
 *
 * @param  {IBlendMode} blend_mode
 * @param  {Float32Array | null} matrix
 * @param  {Float32Array | null} color_transform
 * @param  {boolean} use_filter
 * @param  {Float32Array | null} filter_bounds
 * @param  {Float32Array | null} filter_params
 * @param  {string} unique_key
 * @param  {string} filter_key
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    blend_mode: IBlendMode,
    matrix: Float32Array | null,
    color_transform: Float32Array | null,
    use_filter: boolean,
    filter_bounds: Float32Array | null,
    filter_params: Float32Array | null,
    unique_key: string,
    filter_key: string
): void => {

    // 一時アタッチメントへの描画をフラッシュ
    $context.drawArraysInstanced();

    const layerAttachment = $context.$mainAttachmentObject as IAttachmentObject;

    let textureObject: ITextureObject | null = null;

    if (use_filter && matrix && filter_bounds && params) {

        // キャッシュ判定（ContextApplyFilterUseCaseと同じパターン）
        const matrixKey = $cacheStore.generateFilterKeys(
            matrix[0], matrix[1], matrix[2], matrix[3]
        );

        let useCache = false;
        if (filter_key) {
            const cachedKey = $cacheStore.get(filter_key, "fKey");
            if (cachedKey === matrixKey) {
                const cachedTexture = $cacheStore.get(filter_key, "fTexture") as ITextureObject;
                if (updated) {
                    // キャッシュ無効化：古いテクスチャを解放
                    if (cachedTexture) {
                        textureManagerReleaseTextureObjectUseCase(cachedTexture);
                    }
                } else if (cachedTexture) {
                    // キャッシュヒット：フィルターチェーンをスキップ
                    useCache = true;
                    textureObject = cachedTexture;
                    $offset.x = $cacheStore.get(filter_key, "offsetX") || 0;
                    $offset.y = $cacheStore.get(filter_key, "offsetY") || 0;
                }
            }
        }

        // mainを復元
        $context.$mainAttachmentObject = $containerLayerStack.pop() as IAttachmentObject;

        // 一時アタッチメントを解放（テクスチャも解放）
        frameBufferManagerReleaseAttachmentObjectUseCase(layerAttachment);

        if (!useCache) {

            // フィルターの場合：レイヤー範囲でテクスチャを切り出し
            textureObject = frameBufferManagerGetTextureFromBoundsUseCase(
                x_min, y_min, width, height
            );

            // フィルターチェーンを適用
            $offset.x = 0;
            $offset.y = 0;

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
                            textureObject, matrix,
                            params[idx++], params[idx++], params[idx++]
                        );
                        break;

                    case 2: // ColorMatrixFilter
                        for (let i = 0; i < 20; ++i) {
                            $colorMatrixBuffer[i] = params[idx++];
                        }
                        textureObject = filterApplyColorMatrixFilterUseCase(
                            textureObject,
                            $colorMatrixBuffer
                        );
                        break;

                    case 3: // ConvolutionFilter
                        {
                            const matrixX = params[idx++];
                            const matrixY = params[idx++];
                            const length = matrixX * matrixY;
                            const convMatrix = params.subarray(idx, idx + length);
                            idx += length;

                            textureObject = filterApplyConvolutionFilterUseCase(
                                textureObject, matrixX, matrixY, convMatrix,
                                params[idx++], params[idx++],
                                Boolean(params[idx++]), Boolean(params[idx++]),
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
                                textureObject, buffer,
                                params[idx++], params[idx++],
                                params[idx++], params[idx++],
                                params[idx++], params[idx++],
                                params[idx++], params[idx++],
                                params[idx++], params[idx++],
                                params[idx++]
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
                            params[idx++], params[idx++],
                            Boolean(params[idx++]), Boolean(params[idx++])
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

            // キャッシュに保存
            if (filter_key) {
                $cacheStore.set(filter_key, "fKey", matrixKey);
                $cacheStore.set(filter_key, "fTexture", textureObject);
                $cacheStore.set(filter_key, "offsetX", $offset.x);
                $cacheStore.set(filter_key, "offsetY", $offset.y);
            }
        }

        // フィルター結果をメインに描画
        if (textureObject) {
            const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            const devicePixelRatio = $getDevicePixelRatio();
            const boundsXMin = filter_bounds[0] * (scaleX / devicePixelRatio);
            const boundsYMin = filter_bounds[1] * (scaleY / devicePixelRatio);

            $context.reset();
            $context.setTransform(1, 0, 0, 1, 0, 0);
            $context.globalCompositeOperation = blend_mode;
            blendDrawFilterToMainUseCase(
                textureObject, $identityColorTransform,
                x_min + boundsXMin - $offset.x,
                y_min + boundsYMin - $offset.y
            );

            // キャッシュされていないテクスチャのみ解放
            if (!filter_key) {
                textureManagerReleaseTextureObjectUseCase(textureObject);
            }
        }

    } else {

        // ブレンドのみの場合：一時アタッチメントのテクスチャを直接使用
        textureObject = tempAttachment.texture as ITextureObject;

        // mainを復元
        $context.$mainAttachmentObject = $containerLayerStack.pop() as IAttachmentObject;

        // 一時アタッチメントを解放（テクスチャは保持）
        frameBufferManagerReleaseAttachmentObjectUseCase(tempAttachment, false);

        if (textureObject) {
            $context.reset();
            $context.setTransform(1, 0, 0, 1, 0, 0);
            $context.globalCompositeOperation = blend_mode;
            blendDrawFilterToMainUseCase(
                textureObject, $identityColorTransform,
                0, 0
            );

            textureManagerReleaseTextureObjectUseCase(textureObject);
        }
    }

    // メインのアタッチメントをバインド
    $context.bind($context.$mainAttachmentObject as IAttachmentObject);
};
