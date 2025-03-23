import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../GradientVariants";
import { execute as variantsGradientCreateCollectionKeyService } from "../service/VariantsGradientCreateCollectionKeyService";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import { GRADIENT_TEMPLATE } from "../../../Fragment/FragmentShaderSourceGradient";

/**
 * @description グラデーションのシェーダを生成して返却
 *              Generate and return the shader of gradient
 *
 * @param  {boolean} is_radial
 * @param  {boolean} has_focal_point
 * @param  {number} spread_method
 * @param  {boolean} use_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    is_radial: boolean,
    has_focal_point: boolean,
    spread_method: number,
    use_grid: boolean
): ShaderManager => {

    const key = variantsGradientCreateCollectionKeyService(
        use_grid, is_radial, has_focal_point, spread_method
    );

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const highpLength = (use_grid ? 14 : 5) + 1;
    const fragmentIndex = highpLength - 1;

    const shaderManager = new ShaderManager(
        FILL_TEMPLATE(highpLength, true, false, use_grid),
        GRADIENT_TEMPLATE(
            highpLength, fragmentIndex,
            is_radial, has_focal_point, spread_method
        )
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};