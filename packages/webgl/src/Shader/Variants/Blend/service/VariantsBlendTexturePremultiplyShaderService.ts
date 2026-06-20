import { TEXTURE_PREMULTIPLY } from "../../../Fragment/FragmentShaderSourceTexture";
import { ShaderManager } from "../../../ShaderManager";
import { BLEND_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { $collection } from "../../BlendVariants";

/**
 * @description ストレートアルファのテクスチャをプリマルチプライドアルファへ変換して描画する
 *              シェーダーを生成して返却。画像(Bitmap)・TextField・Video など、ストレート
 *              アルファのソースをプリマルチプライ空間のアトラスへ合成する用途で使用する。
 *              Generate and return the shader that converts a straight-alpha texture into
 *              premultiplied alpha. Used for compositing straight-alpha sources (Bitmap
 *              image, TextField, Video) into the premultiplied-alpha atlas.
 *
 * @return {ShaderManager}
 * @method
 * @protected
 */
export const execute = (): ShaderManager =>
{
    const key = "pp";

    if ($collection.has(key)) {
        return $collection.get(key) as NonNullable<ShaderManager>;
    }

    const shaderManager = new ShaderManager(
        BLEND_TEMPLATE(),
        TEXTURE_PREMULTIPLY()
    );

    $collection.set(key, shaderManager);

    return shaderManager;
};
