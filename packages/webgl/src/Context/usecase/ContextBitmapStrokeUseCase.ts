import { $getVertices } from "../../PathCommand";
import { execute as textureManagerCreateFromPixelsUseCase } from "../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as vertexArrayObjectBindStrokeMeshUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindStrokeMeshUseCase";
import { execute as vertexArrayObjectReleaseStrokeVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseStrokeVertexArrayObjectService";
import { execute as shaderManagerStrokeUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerStrokeUseCase";
import { execute as variantsBitmapShaderService } from "../../Shader/Variants/Bitmap/service/VariantsBitmapShaderService";
import { execute as shaderManagerSetBitmapStrokeUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBitmapStrokeUniformService";

/**
 * @description パスコマンドの線のビットマップの描画を実行します。
 *              Execute drawing of bitmap of line of path command.
 * 
 * @param  {Uint8Array} pixels 
 * @param  {number} width 
 * @param  {number} height 
 * @param  {boolean} repeat 
 * @param  {boolean} smooth 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    pixels: Uint8Array,
    width: number,
    height: number,
    repeat: boolean,
    smooth: boolean
): void => {

    const textureObject = textureManagerCreateFromPixelsUseCase(width, height, pixels);

    const vertices = $getVertices(true);
    if (!vertices.length) {
        return ;
    }
    const vertexArrayObject = vertexArrayObjectBindStrokeMeshUseCase(vertices);

    const shaderManager = variantsBitmapShaderService(true, Boolean(repeat), Boolean(smooth));
    shaderManagerSetBitmapStrokeUniformService(shaderManager, width, height);
    
    shaderManagerStrokeUseCase(
        shaderManager,
        vertexArrayObject
    );

    // release vertex array object
    vertexArrayObjectReleaseStrokeVertexArrayObjectService(vertexArrayObject);

    // release texture
    textureManagerReleaseTextureObjectUseCase(textureObject);
};