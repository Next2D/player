import type { ShaderManager } from "../../Shader/ShaderManager";
import { $getVertices } from "../../PathCommand";
import { execute as variantsBitmapShaderService } from "../../Shader/Variants/Bitmap/service/VariantsBitmapShaderService";
import { execute as shaderManagerSetBitmapFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBitmapFillUniformService";
import { execute as vertexArrayObjectCreateFillObjectUseCase } from "../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase";
import { execute as vertexArrayObjectReleaseVertexArrayObjectService } from "../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as textureManagerCreateFromPixelsUseCase } from "../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { $gl } from "../../WebGLUtil";

/**
 * @description パスコマンドのビットマップ塗り実行します。
 *              Execute bitmap painting of path commands.
 *
 * @param  {Uint8Array} pixels
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} repeat
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

    const textureObject = textureManagerCreateFromPixelsUseCase(
        width, height, pixels, smooth
    );

    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    const vertexArrayObject = vertexArrayObjectCreateFillObjectUseCase(vertices);

    // mask on
    $gl.enable($gl.STENCIL_TEST);
    $gl.stencilMask(0xff);

    // draw shape
    $gl.enable($gl.SAMPLE_ALPHA_TO_COVERAGE);
    $gl.stencilFunc($gl.ALWAYS, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.INVERT, $gl.INVERT);
    $gl.colorMask(false, false, false, false);

    const coverageShader = variantsShapeMaskShaderService(false);
    shaderManagerSetMaskUniformService(coverageShader);
    shaderManagerFillUseCase(coverageShader, vertexArrayObject);
    $gl.disable($gl.SAMPLE_ALPHA_TO_COVERAGE);

    // draw shape range
    $gl.stencilFunc($gl.NOTEQUAL, 0, 0xff);
    $gl.stencilOp($gl.KEEP, $gl.ZERO, $gl.ZERO);
    $gl.colorMask(true, true, true, true);

    const shaderManager = variantsBitmapShaderService(false, repeat);
    shaderManagerSetBitmapFillUniformService(
        shaderManager, width, height
    );
    shaderManagerFillUseCase(shaderManager as ShaderManager, vertexArrayObject);

    // mask off
    $gl.disable($gl.STENCIL_TEST);

    // release vertex array
    vertexArrayObjectReleaseVertexArrayObjectService(vertexArrayObject);

    // release texture
    textureManagerReleaseTextureObjectUseCase(textureObject);
};