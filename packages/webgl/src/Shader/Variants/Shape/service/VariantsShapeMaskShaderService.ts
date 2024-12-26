import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { MASK } from "../../../Fragment/FragmentShaderSource";

/**
 * @description Shapeのマスクのシェーダを返却
 *              Returns the mask shader of Shape
 *
 * @param  {boolean} use_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (use_grid: boolean): ShaderManager =>
{
    const key = `m${use_grid ? "y" : "n"}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        FILL_TEMPLATE(use_grid ? 9 : 0, false, true, use_grid),
        MASK()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};