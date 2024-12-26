import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { SOLID_FILL_COLOR } from "../../../Fragment/FragmentShaderSource";

/**
 * @description Shapeのノーマルな塗りのシェーダを返却
 *              Returns the normal fill shader of Shape
 *
 * @param  {boolean} use_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (use_grid: boolean): ShaderManager =>
{
    const key = `s${use_grid ? "y" : "n"}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        FILL_TEMPLATE(use_grid ? 9 : 0, false, false, use_grid),
        SOLID_FILL_COLOR()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};