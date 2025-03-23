import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as filterApplyBlurFilterUseCase } from "../../BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as filterApplyBitmapFilterUseCase } from "../../BitmapFilter/usecase/FilterApplyBitmapFilterUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { $context } from "../../../WebGLUtil";
import {
    $offset,
    $intToR,
    $intToG,
    $intToB
} from "../../../Filter";

/**
 * @description GlowFilterを適用する
 *              Apply GlowFilter
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @param  {number} color
 * @param  {number} alpha
 * @param  {number} blur_x
 * @param  {number} blur_y
 * @param  {number} strength
 * @param  {number} quality
 * @param  {number} inner
 * @param  {number} knockout
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix: Float32Array,
    color: number = 0,
    alpha: number = 1,
    blur_x: number = 4,
    blur_y: number = 4,
    strength: number = 1,
    quality: number = 1,
    inner: boolean = false,
    knockout: boolean = false
): ITextureObject => {

    const currentAttachmentObject = $context.currentAttachmentObject;

    const baseWidth   = texture_object.width;
    const baseHeight  = texture_object.height;
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;

    const blurTextureObject = filterApplyBlurFilterUseCase(
        texture_object, matrix, blur_x, blur_y, quality, false
    );

    const blurWidth   = blurTextureObject.width;
    const blurHeight  = blurTextureObject.height;
    const blurOffsetX = $offset.x;
    const blurOffsetY = $offset.y;

    const width  = inner ? baseWidth  : blurWidth;
    const height = inner ? baseHeight : blurHeight;

    const offsetX = blurOffsetX - baseOffsetX;
    const offsetY = blurOffsetY - baseOffsetY;

    const baseTextureX = inner ? 0 : offsetX;
    const baseTextureY = inner ? 0 : offsetY;
    const blurTextureX = inner ? -offsetX : 0;
    const blurTextureY = inner ? -offsetY : 0;

    const type = inner ? "inner" : "outer";

    const textureObject = filterApplyBitmapFilterUseCase(
        texture_object, blurTextureObject, width, height,
        baseWidth, baseHeight, baseTextureX, baseTextureY,
        blurWidth, blurHeight, blurTextureX, blurTextureY,
        true, type, knockout,
        strength, null, null, null,
        $intToR(color, alpha, true),
        $intToG(color, alpha, true),
        $intToB(color, alpha, true),
        alpha,
        0, 0, 0, 0
    );

    textureManagerReleaseTextureObjectUseCase(texture_object);
    textureManagerReleaseTextureObjectUseCase(blurTextureObject);

    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return textureObject;
};