import { COLOR_MATRIX_FILTER_TEMPLATE } from "../../../Fragment/Filter/FragmentShaderSourceColorMatrixFilter";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../FilterVariants";

/**
 * @description ColorMatrixFilterShaderを生成する
 *              Create ColorMatrixFilterShader
 *
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (): ShaderManager =>
{
    const key = "m";

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        TEXTURE_TEMPLATE(),
        COLOR_MATRIX_FILTER_TEMPLATE()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};