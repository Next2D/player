import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../ShapeVariants";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { STROKE_TEMPLATE } from "../../../Vertex/VertexShaderSourceStroke";
import { MASK } from "../../../Fragment/FragmentShaderSource";
import { $gridEnabled } from "../../../../Grid";

/**
 * @description Shapeのマスクのシェーダを返却
 *              Returns the mask shader of Shape
 *
 * @param  {boolean} is_stroke
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (is_stroke: boolean): ShaderManager =>
{
    const isGridEnabled = $gridEnabled();

    const key = `m${is_stroke ? "y" : "n"}${isGridEnabled ? "y" : "n"}`;
    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength   = (isGridEnabled ? 9 : 0) + (is_stroke ? 1 : 0);
    const fragmentIndex = highpLength;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = STROKE_TEMPLATE(
            highpLength, fragmentIndex,
            false, isGridEnabled
        );
    } else {
        vertexShaderSource = FILL_TEMPLATE(
            highpLength, false, true, isGridEnabled
        );
    }

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        MASK()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};