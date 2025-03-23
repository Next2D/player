import { $collection } from "../../BitmapVariants";
import { ShaderManager } from "../../../ShaderManager";
import { FILL_TEMPLATE } from "../../../Vertex/VertexShaderSourceFill";
import {
    BITMAP_PATTERN,
    BITMAP_CLIPPED
} from "../../../Fragment/FragmentShaderSource";

/**
 * @description BitmapShaderを取得
 *              Get BitmapShader
 *
 * @param  {boolean} repeat
 * @param  {boolean} use_grid
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (
    repeat: boolean,
    use_grid: boolean
): ShaderManager => {

    const key = `b${repeat ? "y" : "n"}${use_grid ? "y" : "n"}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const fragmentShaderSource = repeat
        ? BITMAP_PATTERN()
        : BITMAP_CLIPPED();

    const shaderManager = new ShaderManager(
        FILL_TEMPLATE(use_grid ? 14 : 5, true, false, use_grid),
        fragmentShaderSource
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};