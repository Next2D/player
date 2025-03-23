import type { IBlendMode } from "../../../../interface/IBlendMode";
import { BLEND_TEMPLATE } from "../../../Fragment/FragmentShaderSourceBlend";
import { ShaderManager } from "../../../ShaderManager";
import { TEXTURE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../BlendVariants";

/**
 * @description Blendのシェーダーを生成して返却
 *              Generate and return the shader of Blend
 *
 * @param  {IBlendMode} operation
 * @param  {boolean} with_color_transform
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (operation: IBlendMode, with_color_transform: boolean): ShaderManager =>
{
    const key = `i${operation}${with_color_transform ? "y" : "n"}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        TEXTURE_TEMPLATE(),
        BLEND_TEMPLATE(operation, with_color_transform)
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};