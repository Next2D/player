import {
    $getFromCache,
    $addToCache
} from "../../GradientLUTVariants";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { GRADIENT_LUT_TEMPLATE } from "../../../Fragment/FragmentShaderSourceGradientLUT";

/**
 * @description グラデーションLUTのシェーダーを返却（LRUキャッシュ使用）
 *              Returns the shader of the gradient LUT (using LRU cache)
 *
 * @param  {number} stops_length
 * @param  {boolean} is_linear_space
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    stops_length: number,
    is_linear_space: boolean
): ShaderManager => {

    const key1 = ("00" + stops_length).slice(-3);
    const key2 = is_linear_space ? "y" : "n";
    const key  = `l${key1}${key2}`;

    // LRUキャッシュから取得を試みる
    const cachedShader = $getFromCache(key);
    if (cachedShader) {
        return cachedShader;
    }

    const mediumpLength: number = Math.ceil(stops_length * 5 / 4);

    const shader = new ShaderManager(
        TEXTURE_TEMPLATE(),
        GRADIENT_LUT_TEMPLATE(mediumpLength, stops_length, is_linear_space)
    );

    // LRUキャッシュに追加
    $addToCache(key, shader);

    return shader;
};