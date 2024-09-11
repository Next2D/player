import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { STROKE_TEMPLATE } from "../../../Vertex/VertexShaderSourceStroke";
import { SOLID_COLOR } from "../../../Fragment/FragmentShaderSource";

/**
 * @description Shapeのノーマルな塗りのシェーダを返却
 *              Returns the normal fill shader of Shape
 *
 * @param  {boolean} is_stroke
 * @param  {boolean} has_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (is_stroke: boolean, has_grid: boolean): ShaderManager =>
{
    const key: string = `s${is_stroke ? "y" : "n"}${has_grid ? "y" : "n"}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength: number = (has_grid ? 8 : 0) + (is_stroke ? 1 : 0);
    const fragmentIndex: number = highpLength;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = STROKE_TEMPLATE(
            highpLength, fragmentIndex,
            false, has_grid
        );
    } else {
        vertexShaderSource = FILL_TEMPLATE(
            highpLength, false, false, has_grid
        );
    }

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        SOLID_COLOR()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};