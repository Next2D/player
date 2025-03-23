import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind01UseCase } from "../../../TextureManager/usecase/TextureManagerBind01UseCase";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as textureManagerBind02UseCase } from "../../../TextureManager/usecase/TextureManagerBind02UseCase";
import { execute as textureManagerBind012UseCase } from "../../../TextureManager/usecase/TextureManagerBind012UseCase";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendSourceInService } from "../../../Blend/service/BlendSourceInService";
import { execute as blendSourceAtopService } from "../../../Blend/service/BlendSourceAtopService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as variantsBitmapFilterShaderService } from "../../../Shader/Variants/Filter/service/VariantsBitmapFilterShaderService";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as shaderManagerSetBitmapFilterUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetBitmapFilterUniformService";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as variantsBlendTextureShaderService } from "../../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService";
import { execute as shaderManagerSetTextureUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService";
import { execute as gradientLUTGenerateFilterTextureUseCase } from "../../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateFilterTextureUseCase";
import { $context } from "../../../WebGLUtil";

/**
 * @description BitmapFilterを適用する
 *              Apply BitmapFilter
 *
 * @param  {ITextureObject} texture_object
 * @param  {ITextureObject} blur_texture_object
 * @param  {number} width
 * @param  {number} height
 * @param  {number} base_width
 * @param  {number} base_height
 * @param  {number} base_offset_x
 * @param  {number} base_offset_y
 * @param  {number} blur_width
 * @param  {number} blur_height
 * @param  {number} blur_offset_x
 * @param  {number} blur_offset_y
 * @param  {boolean} is_glow
 * @param  {string} type
 * @param  {boolean} knockout
 * @param  {number} strength
 * @param  {Float32Array | null} ratios
 * @param  {Float32Array | null} colors
 * @param  {Float32Array | null} alphas
 * @param  {number} color_r1
 * @param  {number} color_g1
 * @param  {number} color_b1
 * @param  {number} color_a1
 * @param  {number} color_r2
 * @param  {number} color_g2
 * @param  {number} color_b2
 * @param  {number} color_a2
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    blur_texture_object: ITextureObject,
    width: number,
    height: number,
    base_width: number,
    base_height: number,
    base_offset_x: number,
    base_offset_y: number,
    blur_width: number,
    blur_height: number,
    blur_offset_x: number,
    blur_offset_y: number,
    is_glow: boolean,
    type: string,
    knockout: boolean,
    strength: number,
    ratios: Float32Array | null = null,
    colors: Float32Array | null = null,
    alphas: Float32Array | null = null,
    color_r1: number = 0,
    color_g1: number = 0,
    color_b1: number = 0,
    color_a1: number = 0,
    color_r2: number = 0,
    color_g2: number = 0,
    color_b2: number = 0,
    color_a2: number = 0
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject;

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(width, height, false);
    $context.bind(attachmentObject);

    const isInner    = type === "inner";
    const isGradient = ratios !== null && colors !== null && alphas !== null;

    let gradientTextureObject: ITextureObject | null = null;
    if (isGradient) {
        gradientTextureObject = gradientLUTGenerateFilterTextureUseCase(
            ratios as Float32Array, colors as Float32Array, alphas as Float32Array
        );
    }

    if (isInner) {

        $context.reset();
        $context.setTransform(1, 0, 0, 1, 0, 0);

        textureManagerBind0UseCase(texture_object, true);

        const shaderManager = variantsBlendTextureShaderService();
        shaderManagerSetTextureUniformService(
            shaderManager, texture_object.width, texture_object.height
        );
        shaderManagerDrawTextureUseCase(shaderManager);

        if (isGradient && gradientTextureObject) {
            textureManagerBind02UseCase(
                blur_texture_object,
                gradientTextureObject,
                true
            );
        } else {
            textureManagerBind0UseCase(blur_texture_object, true);
        }

    } else {

        if (isGradient && gradientTextureObject) {
            textureManagerBind012UseCase(
                blur_texture_object,
                texture_object,
                gradientTextureObject,
                true
            );
        } else {
            textureManagerBind01UseCase(
                blur_texture_object,
                texture_object,
                true
            );
        }
    }

    const transformsBase  = !(isInner || type === "full" && knockout);
    const transformsBlur  = !(width === blur_width && height === blur_height && blur_offset_x === 0 && blur_offset_y === 0);
    const appliesStrength = !(strength === 1);

    if (!isInner) {

        blendOneZeroService();

    } else if (knockout) {

        blendSourceInService();

    } else {

        blendSourceAtopService();

    }

    const shaderManager = variantsBitmapFilterShaderService(
        transformsBase, transformsBlur,
        is_glow, type, knockout,
        appliesStrength, isGradient
    );

    shaderManagerSetBitmapFilterUniformService(
        shaderManager, width, height,
        base_width, base_height, base_offset_x, base_offset_y,
        blur_width, blur_height, blur_offset_x, blur_offset_y,
        is_glow, strength,
        color_r1, color_g1, color_b1, color_a1,
        color_r2, color_g2, color_b2, color_a2,
        transformsBase, transformsBlur, appliesStrength, isGradient
    );

    shaderManagerDrawTextureUseCase(shaderManager);

    const textureObject = attachmentObject.texture as ITextureObject;
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

    // ブレンドモードをリセット
    blendResetService();

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};