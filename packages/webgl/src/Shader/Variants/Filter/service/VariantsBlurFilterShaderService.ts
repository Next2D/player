import { BLUR_FILTER_TEMPLATE } from "../../../Fragment/Filter/FragmentShaderSourceBlurFilter";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../FilterVariants";

/**
 * @description BlurFilterShaderを生成する
 *              Create BlurFilterShader
 *
 * @param  {number} half_blur
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (half_blur: number): ShaderManager =>
{
    const key = `b${half_blur}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        TEXTURE_TEMPLATE(),
        BLUR_FILTER_TEMPLATE(half_blur)
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};