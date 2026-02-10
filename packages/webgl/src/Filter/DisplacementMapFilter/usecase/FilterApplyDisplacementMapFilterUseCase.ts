import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerCreateFromPixelsUseCase } from "../../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase";
import { execute as textureManagerBind01UseCase } from "../../../TextureManager/usecase/TextureManagerBind01UseCase";
import { execute as variantsDisplacementMapFilterShaderService } from "../../../Shader/Variants/Filter/service/VariantsDisplacementMapFilterShaderService";
import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as shaderManagerDrawTextureUseCase } from "../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as shaderManagerSetDisplacementMapFilterUniformService } from "../../../Shader/ShaderManager/service/ShaderManagerSetDisplacementMapFilterUniformService";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { $context } from "../../../WebGLUtil";
import {
    $intToR,
    $intToG,
    $intToB
} from "../../../Filter";

/**
 * @description ディスプレイスメントマップ・フィルタを適用する
 *              Apply displacement map filter
 *
 * @param  {ITextureObject} texture_object
 * @param  {Uint8Array} bitmap_buffer
 * @param  {number} bitmap_width
 * @param  {number} bitmap_height
 * @param  {number} map_point_x
 * @param  {number} map_point_y
 * @param  {number} component_x
 * @param  {number} component_y
 * @param  {number} scale_x
 * @param  {number} scale_y
 * @param  {number} mode
 * @param  {number} color
 * @param  {number} alpha
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    bitmap_buffer: Uint8Array,
    bitmap_width: number = 0,
    bitmap_height: number = 0,
    map_point_x: number = 0,
    map_point_y: number = 0,
    component_x: number = 0,
    component_y: number = 0,
    scale_x: number = 0,
    scale_y: number = 0,
    mode: number = 2,
    color: number = 0,
    alpha: number = 0
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject;

    const width  = texture_object.width;
    const height = texture_object.height;

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(
        width, height, false
    );
    $context.bind(attachmentObject);

    const pixelTextureObject = textureManagerCreateFromPixelsUseCase(
        bitmap_width, bitmap_height, bitmap_buffer
    );

    textureManagerBind01UseCase(
        texture_object,
        pixelTextureObject
    );

    const shaderManager = variantsDisplacementMapFilterShaderService(
        component_x, component_y, mode
    );

    shaderManagerSetDisplacementMapFilterUniformService(
        shaderManager,
        bitmap_width, bitmap_height, bitmap_width, bitmap_height,
        map_point_x, map_point_y, scale_x, scale_y, mode,
        $intToR(color, alpha, true),
        $intToG(color, alpha, true),
        $intToB(color, alpha, true),
        alpha
    );

    blendResetService();
    shaderManagerDrawTextureUseCase(shaderManager);

    const textureObject = attachmentObject.texture as ITextureObject;

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    textureManagerReleaseTextureObjectUseCase(texture_object);
    textureManagerReleaseTextureObjectUseCase(pixelTextureObject);
    frameBufferManagerReleaseAttachmentObjectUseCase(attachmentObject, false);

    return textureObject;
};