import { $collection } from "../../GradientLUTVariants";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { GRADIENT_LUT_TEMPLATE } from "../../../Fragment/FragmentShaderSourceGradientLUT";

/**
 * @description グラデーションLUTのシェーダーを返却
 *              Returns the shader of the gradient LUT
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

    const key1: string = ("00" + stops_length).slice(-3);
    const key2: string = is_linear_space ? "y" : "n";
    const key: string  = `l${key1}${key2}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const mediumpLength: number = Math.ceil(stops_length * 5 / 4);

    const shader = new ShaderManager(
        TEXTURE_TEMPLATE(),
        GRADIENT_LUT_TEMPLATE(mediumpLength, stops_length, is_linear_space)
    );

    $collection.set(key, shader);

    return shader;
};