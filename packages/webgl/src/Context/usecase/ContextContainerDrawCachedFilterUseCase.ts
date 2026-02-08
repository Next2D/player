import type { IBlendMode } from "../../interface/IBlendMode";
import type { ITextureObject } from "../../interface/ITextureObject";
import { execute as blendDrawFilterToMainUseCase } from "../../Blend/usecase/BlendDrawFilterToMainUseCase";
import { $cacheStore } from "@next2d/cache";
import {
    $context,
    $devicePixelRatio
} from "../../WebGLUtil";

/**
 * @description キャッシュされたフィルターテクスチャをメインに描画します。
 *              Draw a cached filter texture to the main attachment.
 *
 * @param  {IBlendMode} blend_mode
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @param  {Float32Array} filter_bounds
 * @param  {string} unique_key
 * @param  {string} filter_key
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    blend_mode: IBlendMode,
    matrix: Float32Array,
    color_transform: Float32Array,
    filter_bounds: Float32Array,
    unique_key: string,
    filter_key: string
): void => {

    const cachedKey = $cacheStore.get(unique_key, "fKey");
    if (cachedKey !== filter_key) {
        return;
    }

    const textureObject = $cacheStore.get(unique_key, "fTexture") as ITextureObject;
    if (!textureObject) {
        return;
    }

    const scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
    const devicePixelRatio = $devicePixelRatio;
    const boundsXMin = filter_bounds[0] * (scaleX / devicePixelRatio);
    const boundsYMin = filter_bounds[1] * (scaleY / devicePixelRatio);

    $context.drawArraysInstanced();
    $context.reset();
    $context.globalCompositeOperation = blend_mode;
    blendDrawFilterToMainUseCase(
        textureObject, color_transform,
        boundsXMin + matrix[4],
        boundsYMin + matrix[5]
    );
};
