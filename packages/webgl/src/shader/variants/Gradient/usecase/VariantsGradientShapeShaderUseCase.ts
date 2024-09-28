import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../GradientVariants";
import { execute as variantsGradientCreateCollectionKeyService } from "../service/VariantsGradientCreateCollectionKeyService";
import { $gridEnabled } from "../../../../Grid";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { STROKE_TEMPLATE } from "../../../Vertex/VertexShaderSourceStroke";
import { GRADIENT_TEMPLATE } from "../../../Fragment/FragmentShaderSourceGradient";

/**
 * @description グラデーションのシェーダを生成して返却
 *              Generate and return the shader of gradient
 *
 * @param  {boolean} is_stroke
 * @param  {boolean} is_radial
 * @param  {boolean} has_focal_point
 * @param  {number} spread_method
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    is_stroke: boolean,
    is_radial: boolean,
    has_focal_point: boolean,
    spread_method: number
): ShaderManager => {

    const isGridEnabled = $gridEnabled();
    const key: string = variantsGradientCreateCollectionKeyService(
        is_stroke, isGridEnabled, is_radial, has_focal_point, spread_method
    );

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength: number = (isGridEnabled ? 13 : 5) + (is_stroke ? 1 : 0) + 1;
    const fragmentIndex: number = highpLength - 1;

    let vertexShaderSource: string;
    if (is_stroke) {
        vertexShaderSource = STROKE_TEMPLATE(
            highpLength, fragmentIndex,
            true, isGridEnabled
        );
    } else {
        vertexShaderSource = FILL_TEMPLATE(
            highpLength, true, false, isGridEnabled
        );
    }

    const shaderManager = new ShaderManager(
        vertexShaderSource,
        GRADIENT_TEMPLATE(
            highpLength, fragmentIndex,
            is_radial, has_focal_point, spread_method
        )
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};