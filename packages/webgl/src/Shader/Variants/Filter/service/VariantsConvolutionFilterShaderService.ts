import { CONVOLUTION_FILTER_TEMPLATE } from "../../../Fragment/Filter/FragmentShaderSourceConvolutionFilter";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../FilterVariants";

/**
 * @description ConvolutionFilterShaderを生成する
 *              Create ConvolutionFilterShader
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {boolean} preserve_alpha
 * @param  {boolean} clamp
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    x: number, 
    y: number,
    preserve_alpha: boolean, 
    clamp: boolean
): ShaderManager => {

    const key1 = ("0" + x).slice(-2);
    const key2 = ("0" + y).slice(-2);
    const key3 = preserve_alpha ? "y" : "n";
    const key4 = clamp ? "y" : "n";
    const key  = `c${key1}${key2}${key3}${key4}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const mediumpLength: number = (clamp ? 1 : 2) + Math.ceil(x * y / 4);

    const shaderManager = new ShaderManager(
        TEXTURE_TEMPLATE(),
        CONVOLUTION_FILTER_TEMPLATE(mediumpLength, x, y, preserve_alpha, clamp)
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};