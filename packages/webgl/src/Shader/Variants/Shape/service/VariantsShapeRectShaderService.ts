import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_RECT_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { FILL_RECT_COLOR } from "../../../Fragment/FragmentShaderSource";

/**
 * @description 画面全体の矩形専用のシェーダを返却
 *              Returns a shader dedicated to the entire screen rectangle
 *
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (): ShaderManager =>
{
    const key = "rmnn";

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        FILL_RECT_TEMPLATE(),
        FILL_RECT_COLOR()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};