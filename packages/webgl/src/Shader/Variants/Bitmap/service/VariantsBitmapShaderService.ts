import { $collection } from "../../BitmapVariants";
import { ShaderManager } from "../../../ShaderManager";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { STROKE_TEMPLATE } from "../../../Vertex/VertexShaderSourceStroke";
import {
    BITMAP_PATTERN,
    BITMAP_CLIPPED
} from "../../../Fragment/FragmentShaderSource";

/**
 * @description BitmapShaderを取得
 *              Get BitmapShader
 *
 * @param  {boolean} is_stroke
 * @param  {boolean} repeat
 * @param  {boolean} use_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    is_stroke: boolean,
    repeat: boolean,
    use_grid: boolean
): ShaderManager => {

    const key: string = `b${is_stroke ? "y" : "n"}${repeat ? "y" : "n"}${use_grid ? "y" : "n"}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength = (use_grid ? 14 : 5) + (is_stroke ? 1 : 0);
    const fragmentIndex = highpLength;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = STROKE_TEMPLATE(
            highpLength, fragmentIndex,
            true, use_grid
        );
    } else {
        vertexShaderSource = FILL_TEMPLATE(
            highpLength, true, false, use_grid
        );
    }

    const fragmentShaderSource = repeat
        ? BITMAP_PATTERN()
        : BITMAP_CLIPPED();

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        fragmentShaderSource
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};