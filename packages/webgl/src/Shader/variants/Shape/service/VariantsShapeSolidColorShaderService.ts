import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { STROKE_TEMPLATE } from "../../../Vertex/VertexShaderSourceStroke";
import { $gridEnabled } from "../../../../Grid";
import {
    SOLID_FILL_COLOR,
    SOLID_STROKE_COLOR
} from "../../../Fragment/FragmentShaderSource";

/**
 * @description Shapeのノーマルな塗りのシェーダを返却
 *              Returns the normal fill shader of Shape
 *
 * @param  {boolean} is_stroke
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (is_stroke: boolean): ShaderManager =>
{
    const isGridEnabled = $gridEnabled();

    const key: string = `s${is_stroke ? "y" : "n"}${isGridEnabled ? "y" : "n"}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength: number = (isGridEnabled ? 9 : 0) + (is_stroke ? 4 : 0);
    const fragmentIndex: number = highpLength;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = STROKE_TEMPLATE(
            highpLength, fragmentIndex,
            false, isGridEnabled
        );
    } else {
        vertexShaderSource = FILL_TEMPLATE(
            highpLength, false, false, isGridEnabled
        );
    }

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        is_stroke ? SOLID_STROKE_COLOR() : SOLID_FILL_COLOR()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};