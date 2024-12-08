import { TEXTURE } from "../../../Fragment/FragmentShaderSourceTexture";
import { ShaderManager } from "../../../ShaderManager";
import { BLEND_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../BlendVariants";

/**
 * @description Textureのシェーダーを生成して返却
 *              Generate and return the shader of Texture
 *
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (): ShaderManager =>
{
    const key: string = "p";

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        BLEND_TEMPLATE(),
        TEXTURE(false)
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};