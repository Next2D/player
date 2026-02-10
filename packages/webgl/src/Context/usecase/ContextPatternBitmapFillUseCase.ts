import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import { execute as variantsShapeMaskShaderService } from "../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService";
import { execute as shaderManagerSetMaskUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService";
import { execute as shaderManagerFillUseCase } from "../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase";
import { execute as variantsBitmapShaderService } from "../../Shader/Variants/Bitmap/service/VariantsBitmapShaderService";
import { execute as shaderManagerSetBitmapFillUniformService } from "../../Shader/ShaderManager/service/ShaderManagerSetBitmapFillUniformService";
import { execute as textureManagerCreateFromPixelsUseCase } from "../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { execute as stencilSetMaskModeService } from "../../Stencil/service/StencilSetMaskModeService";
import { execute as stencilSetFillModeService } from "../../Stencil/service/StencilSetFillModeService";
import { execute as stencilEnableSampleAlphaToCoverageService } from "../../Stencil/service/StencilEnableSampleAlphaToCoverageService";
import { execute as stencilDisableSampleAlphaToCoverageService } from "../../Stencil/service/StencilDisableSampleAlphaToCoverageService";
import { $bitmapData } from "../../Bitmap";
import { $context } from "../../WebGLUtil";

/**
 * @description ビットマップパターンのシェーダーを実行します。
 *              Execute the bitmap pattern shader.
 *
 * @param  {IVertexArrayObject} vertex_array_object
 * @param  {number} offset
 * @param  {number} index_count
 * @param  {Float32Array | null} [grid_data=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    vertex_array_object: IVertexArrayObject,
    offset: number,
    index_count: number,
    grid_data: Float32Array | null
): void => {

    // mask setting (cached)
    stencilSetMaskModeService();

    const useGrid = !!grid_data;
    const coverageShader = variantsShapeMaskShaderService(useGrid);
    if (grid_data) {
        shaderManagerSetMaskUniformService(coverageShader, grid_data);
    }

    stencilEnableSampleAlphaToCoverageService();
    shaderManagerFillUseCase(
        coverageShader, vertex_array_object, offset, index_count
    );
    stencilDisableSampleAlphaToCoverageService();

    // bitmap setting
    const pixels = $bitmapData.shift() as Uint8Array;
    const matrix = $bitmapData.shift() as Float32Array;
    const width  = $bitmapData.shift() as number;
    const height = $bitmapData.shift() as number;
    const repeat = $bitmapData.shift() as boolean;
    const smooth = $bitmapData.shift() as boolean;

    const textureObject = textureManagerCreateFromPixelsUseCase(
        width, height, pixels, smooth
    );

    $context.save();
    $context.transform(
        matrix[0], matrix[1], matrix[2],
        matrix[3], matrix[4], matrix[5]
    );

    // draw shape setting (cached)
    stencilSetFillModeService();

    const shaderManager = variantsBitmapShaderService(repeat, useGrid);
    shaderManagerSetBitmapFillUniformService(
        shaderManager, width, height, grid_data
    );
    shaderManagerFillUseCase(
        shaderManager, vertex_array_object, offset, index_count
    );

    $context.restore();

    textureManagerReleaseTextureObjectUseCase(textureObject);
};