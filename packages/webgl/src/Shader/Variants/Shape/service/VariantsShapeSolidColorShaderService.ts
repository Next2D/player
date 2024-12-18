import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { STROKE_TEMPLATE } from "../../../Vertex/VertexShaderSourceStroke";
import {
    SOLID_FILL_COLOR,
    SOLID_STROKE_COLOR
} from "../../../Fragment/FragmentShaderSource";

/**
 * @description Shapeのノーマルな塗りのシェーダを返却
 *              Returns the normal fill shader of Shape
 *
 * @param  {boolean} is_stroke
 * @param  {boolean} use_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (is_stroke: boolean, use_grid: boolean): ShaderManager =>
{
    const key: string = `s${is_stroke ? "y" : "n"}${use_grid ? "y" : "n"}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength: number = (use_grid ? 9 : 0) + (is_stroke ? 4 : 0);
    const fragmentIndex: number = highpLength;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = STROKE_TEMPLATE(
            highpLength, fragmentIndex,
            false, use_grid
        );
    } else {
        vertexShaderSource = FILL_TEMPLATE(
            highpLength, false, false, use_grid
        );
    }

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        is_stroke ? SOLID_STROKE_COLOR() : SOLID_FILL_COLOR()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};