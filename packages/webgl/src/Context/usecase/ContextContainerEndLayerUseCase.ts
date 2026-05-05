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
    $devicePixelRatio
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
 * @description コンテナのフィルター/ブレンド用レイヤーを終了し、結果を元のメインに合成します。
 *              End the container layer and composite the result back to the original main.
 *
 * @param  {IBlendMode} blend_mode
 * @param  {Float32Array} matrix
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
    matrix: Float32Array,
    color_transform: Float32Array | null,
    use_filter: boolean,
    filter_bounds: Float32Array | null,
    filter_params: Float32Array | null,
    unique_key: string,
    filter_key: string,
    // layer_scale は display 側で layer サイズに反映済み。
    // compose時は layer 全体を等倍でmainに貼るので直接は参照しない。
    _layer_scale_x: number = 1,
    _layer_scale_y: number = 1
): void => {

    // 一時アタッチメントへの描画をフラッシュ
    $context.drawArraysInstanced();

    const layerAttachment = $context.$mainAttachmentObject as IAttachmentObject;

    let textureObject: ITextureObject | null = null;

    if (use_filter && filter_bounds && filter_params) {

        // containerEndLayerが呼ばれる＝ディスプレイレイヤーがコンテンツ変更を検出して再レンダリングを要求
        // 常に新鮮なテクスチャを抽出してフィルターを適用する
        // （キャッシュはディスプレイレイヤーのcontainerDrawCachedFilterで管理）

        // レイヤーが有効な間にテクスチャを切り出し（リリース前に実行）
        textureObject = frameBufferManagerGetTextureFromBoundsUseCase(
            0, 0, layerAttachment.width, layerAttachment.height
        );

        // mainを復元
        $context.$mainAttachmentObject = $containerLayerStack.pop() as IAttachmentObject;

        // 一時アタッチメントを解放
        frameBufferManagerReleaseAttachmentObjectUseCase(layerAttachment);

        // メインのアタッチメントをバインド（currentAttachmentObjectを更新）
        $context.bind($context.$mainAttachmentObject as IAttachmentObject);

        // フィルターチェーンを適用
        $offset.x = 0;
        $offset.y = 0;

        for (let idx = 0; filter_params.length > idx; ) {

            const type = filter_params[idx++];
            switch (type) {

                case 0: // BevelFilter
                    textureObject = filterApplyBevelFilterUseCase(
                        textureObject, matrix,
                        filter_params[idx++], filter_params[idx++], filter_params[idx++], filter_params[idx++],
                        filter_params[idx++], filter_params[idx++], filter_params[idx++], filter_params[idx++],
                        filter_params[idx++], filter_params[idx++], filter_params[idx++], Boolean(filter_params[idx++])
                    );
                    break;

                case 1: // BlurFilter
                    textureObject = filterApplyBlurFilterUseCase(
                        textureObject, matrix,
                        filter_params[idx++], filter_params[idx++], filter_params[idx++]
                    );
                    break;

                case 2: // ColorMatrixFilter
                    for (let i = 0; i < 20; ++i) {
                        $colorMatrixBuffer[i] = filter_params[idx++];
                    }
                    textureObject = filterApplyColorMatrixFilterUseCase(
                        textureObject,
                        $colorMatrixBuffer
                    );
                    break;

                case 3: // ConvolutionFilter
                    {
                        const matrixX = filter_params[idx++];
                        const matrixY = filter_params[idx++];
                        const length = matrixX * matrixY;
                        const convMatrix = filter_params.subarray(idx, idx + length);
                        idx += length;

                        textureObject = filterApplyConvolutionFilterUseCase(
                            textureObject, matrixX, matrixY, convMatrix,
                            filter_params[idx++], filter_params[idx++],
                            Boolean(filter_params[idx++]), Boolean(filter_params[idx++]),
                            filter_params[idx++], filter_params[idx++]
                        );
                    }
                    break;

                case 4: // DisplacementMapFilter
                    {
                        const length = filter_params[idx++];
                        const buffer = new Uint8Array(length);
                        buffer.set(filter_params.subarray(idx, idx + length));
                        idx += length;

                        textureObject = filterApplyDisplacementMapFilterUseCase(
                            textureObject, buffer,
                            filter_params[idx++], filter_params[idx++],
                            filter_params[idx++], filter_params[idx++],
                            filter_params[idx++], filter_params[idx++],
                            filter_params[idx++], filter_params[idx++],
                            filter_params[idx++], filter_params[idx++],
                            filter_params[idx++]
                        );
                    }
                    break;

                case 5: // DropShadowFilter
                    textureObject = filterApplyDropShadowFilterUseCase(
                        textureObject, matrix,
                        filter_params[idx++], filter_params[idx++], filter_params[idx++], filter_params[idx++],
                        filter_params[idx++], filter_params[idx++], filter_params[idx++], filter_params[idx++],
                        Boolean(filter_params[idx++]), Boolean(filter_params[idx++]), Boolean(filter_params[idx++])
                    );
                    break;

                case 6: // GlowFilter
                    textureObject = filterApplyGlowFilterUseCase(
                        textureObject, matrix,
                        filter_params[idx++], filter_params[idx++], filter_params[idx++], filter_params[idx++],
                        filter_params[idx++], filter_params[idx++],
                        Boolean(filter_params[idx++]), Boolean(filter_params[idx++])
                    );
                    break;

                case 7: // GradientBevelFilter
                    {
                        const distance = filter_params[idx++];
                        const angle    = filter_params[idx++];

                        let length = filter_params[idx++];
                        const colors = filter_params.subarray(idx, idx + length);
                        idx += length;

                        length = filter_params[idx++];
                        const alphas = filter_params.subarray(idx, idx + length);
                        idx += length;

                        length = filter_params[idx++];
                        const ratios = filter_params.subarray(idx, idx + length);
                        idx += length;

                        textureObject = filterApplyGradientBevelFilterUseCase(
                            textureObject, matrix,
                            distance, angle, colors, alphas, ratios,
                            filter_params[idx++], filter_params[idx++], filter_params[idx++],
                            filter_params[idx++], filter_params[idx++], Boolean(filter_params[idx++])
                        );
                    }
                    break;

                case 8: // GradientGlowFilter
                    {
                        const distance = filter_params[idx++];
                        const angle    = filter_params[idx++];

                        let length = filter_params[idx++];
                        const colors = filter_params.subarray(idx, idx + length);
                        idx += length;

                        length = filter_params[idx++];
                        const alphas = filter_params.subarray(idx, idx + length);
                        idx += length;

                        length = filter_params[idx++];
                        const ratios = filter_params.subarray(idx, idx + length);
                        idx += length;

                        textureObject = filterApplyGradientGlowFilterUseCase(
                            textureObject, matrix,
                            distance, angle, colors, alphas, ratios,
                            filter_params[idx++], filter_params[idx++], filter_params[idx++],
                            filter_params[idx++], filter_params[idx++], Boolean(filter_params[idx++])
                        );
                    }
                    break;
            }
        }

        // issue #274: layer は layerScale 倍解像度で確保されており、
        // 子孫のcacheAsBitmap子は既にその倍解像度でlayer内に収まっている。
        // cacheAsBitmap の仕様としてスクリーン上も cacheScale 倍のサイズで
        // 表示されるため、ここでの縮小は行わずそのまま main に合成する。

        // キャッシュに保存（古いfTextureを先に解放してからGPUリーク防止）
        if (unique_key) {
            const oldTexture = $cacheStore.get(unique_key, "fTexture") as ITextureObject | null;
            if (oldTexture) {
                textureManagerReleaseTextureObjectUseCase(oldTexture);
            }
            $cacheStore.set(unique_key, "fKey", filter_key);
            $cacheStore.set(unique_key, "fTexture", textureObject);
        }

        // フィルター結果をメインに描画
        if (textureObject) {
            const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            const devicePixelRatio = $devicePixelRatio;
            const boundsXMin = filter_bounds[0] * (scaleX / devicePixelRatio);
            const boundsYMin = filter_bounds[1] * (scaleY / devicePixelRatio);

            $context.reset();
            $context.globalCompositeOperation = blend_mode;
            blendDrawFilterToMainUseCase(
                textureObject, color_transform as Float32Array,
                boundsXMin + matrix[4],
                boundsYMin + matrix[5]
            );
        }

    } else {

        // ブレンドのみの場合：テクスチャを取得
        textureObject = frameBufferManagerGetTextureFromBoundsUseCase(
            0, 0, layerAttachment.width, layerAttachment.height
        );

        // mainを復元
        $context.$mainAttachmentObject = $containerLayerStack.pop() as IAttachmentObject;

        // 一時アタッチメントを解放
        frameBufferManagerReleaseAttachmentObjectUseCase(layerAttachment);

        // メインのアタッチメントをバインド（currentAttachmentObjectを更新）
        $context.bind($context.$mainAttachmentObject as IAttachmentObject);

        if (textureObject) {
            // cacheAsBitmap と同様、layer は layerScale 倍解像度のままmainに合成する
            $context.reset();
            $context.globalCompositeOperation = blend_mode;
            blendDrawFilterToMainUseCase(
                textureObject, color_transform as Float32Array,
                matrix[4], matrix[5]
            );

            textureManagerReleaseTextureObjectUseCase(textureObject);
        }
    }

    // メインのアタッチメントをバインド
    $context.bind($context.$mainAttachmentObject as IAttachmentObject);
};
