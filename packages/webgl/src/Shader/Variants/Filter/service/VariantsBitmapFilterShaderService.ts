import { BITMAP_FILTER_TEMPLATE } from "../../../Fragment/Filter/FragmentShaderSourceFilter";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../FilterVariants";

/**
 * @description BitmapFilterShaderを生成する
 *              Create BitmapFilterShader
 *
 * @param  {boolean} transforms_base
 * @param  {boolean} transforms_blur
 * @param  {boolean} is_glow
 * @param  {boolean} type
 * @param  {string} transforms_base
 * @param  {boolean} knockout
 * @param  {boolean} applies_strength
 * @param  {boolean} is_gradient
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    transforms_base: boolean,
    transforms_blur: boolean,
    is_glow: boolean,
    type: string,
    knockout: boolean,
    applies_strength: boolean,
    is_gradient: boolean
): ShaderManager => {

    const key1 = transforms_base ? "y" : "n";
    const key2 = transforms_blur ? "y" : "n";
    const key3 = is_glow ? "y" : "n";
    const key4 = knockout ? "y" : "n";
    const key5 = applies_strength ? "y" : "n";
    const key  = `f${key1}${key2}${key3}${type}${key4}${key5}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    let texturesLength = 1;
    if (transforms_base) { texturesLength++ }
    if (is_gradient) { texturesLength++ }

    let mediumpLength = (transforms_base ? 4 : 0)
        + (transforms_blur ? 4 : 0)
        + (applies_strength ? 1 : 0);

    if (!is_gradient) {
        mediumpLength += is_glow ? 4 : 8;
    }

    mediumpLength = Math.ceil(mediumpLength / 4);

    const shaderManager = new ShaderManager(
        TEXTURE_TEMPLATE(),
        BITMAP_FILTER_TEMPLATE(
            texturesLength, mediumpLength,
            transforms_base, transforms_blur,
            is_glow, type, knockout,
            applies_strength, is_gradient
        )
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};