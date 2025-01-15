import { TEXTURE } from "../../../Fragment/FragmentShaderSourceTexture";
import { ShaderManager } from "../../../ShaderManager";
import { BLEND_MATRIX_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../BlendVariants";

/**
 * @description Textureのシェーダーを生成して返却
 *              Generate and return the shader of Texture
 *
 * @param  {boolean} [with_color_transform=false]
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (with_color_transform: boolean = false): ShaderManager =>
{
    const key = `m${with_color_transform ? "y" : "n"}`;

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        BLEND_MATRIX_TEMPLATE(),
        TEXTURE(with_color_transform)
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};