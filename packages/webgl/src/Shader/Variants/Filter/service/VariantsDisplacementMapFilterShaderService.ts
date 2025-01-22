import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../FilterVariants";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { DISPLACEMENT_MAP_FILTER_TEMPLATE } from "../../../Fragment/Filter/FragmentShaderSourceDisplacementMapFilter";

/**
 * @description ディスプレイスメントマップ・フィルタのシェーダーマネージャを取得する
 *              Get the shader manager of the displacement map filter
 *
 * @param  {number} component_x
 * @param  {number} component_y
 * @param  {number} mode
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (component_x: number, component_y: number, mode: number): ShaderManager =>
{
    const key = `d${component_x}${component_y}${mode}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const mediumpLength = mode === 1 ? 3 : 2;

    const shaderManager = new ShaderManager(
        TEXTURE_TEMPLATE(),
        DISPLACEMENT_MAP_FILTER_TEMPLATE(
            mediumpLength, component_x, component_y, mode
        )
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};