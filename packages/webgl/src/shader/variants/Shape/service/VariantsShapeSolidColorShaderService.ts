import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { VertexShaderSourceFill } from "../../../Vertex/VertexShaderSourceFill";
import { VertexShaderSourceStroke } from "../../../Vertex/VertexShaderSourceStroke";
import { FragmentShaderSource } from "../../../Fragment/FragmentShaderSource";

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

    const highpLength: number = (has_grid ? 8 : 3) + (is_stroke ? 1 : 0);
    const fragmentIndex: number = highpLength;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
            highpLength, fragmentIndex,
            false, has_grid
        );
    } else {
        vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
            highpLength, false, false, has_grid
        );
    }

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        FragmentShaderSource.SOLID_COLOR()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};