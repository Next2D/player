import { INSTANCE_TEXTURE } from "../../../Fragment/FragmentShaderSourceTexture";
import { ShaderInstancedManager } from "../../../ShaderInstancedManager";
import { INSTANCE_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../BlendVariants";

/**
 * @description InstancedArrayのシェーダーを生成して返却
 *              Generate and return the shader of InstancedArray
 *
 * @return {ShaderInstancedManager}
 * @method
 * @protected
 */
export const execute = (): ShaderInstancedManager =>
{
    const key: string = "i";

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderInstancedManager>;
    }

    const shaderManager = new ShaderInstancedManager(
        INSTANCE_TEMPLATE(),
        INSTANCE_TEXTURE()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};