import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as filterApplyBlurFilterUseCase } from "../../BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as filterApplyBitmapFilterUseCase } from "../../BitmapFilter/usecase/FilterApplyBitmapFilterUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import {
    $getDevicePixelRatio,
    $context
} from "../../../WebGLUtil";
import {
    $offset,
    $intToR,
    $intToG,
    $intToB
} from "../../../Filter";

/**
 * @type {number}
 * @private
 */
const $Deg2Rad: number = Math.PI / 180;

/**
 * @description ドロップシャドウフィルターを適用します。
 *              Apply the drop shadow filter.
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @param  {number} distance
 * @param  {number} angle
 * @param  {number} color
 * @param  {number} alpha
 * @param  {number} blur_x
 * @param  {number} blur_y
 * @param  {number} strength
 * @param  {number} quality
 * @param  {number} inner
 * @param  {number} knockout
 * @param  {number} hide_object
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix: Float32Array,
    distance: number = 4,
    angle: number = 45,
    color: number = 0,
    alpha: number = 1,
    blur_x: number = 4,
    blur_y: number = 4,
    strength: number = 1,
    quality: number = 1,
    inner: boolean = false,
    knockout: boolean = false,
    hide_object: boolean = false
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

    const offsetDiffX = blurOffsetX - baseOffsetX;
    const offsetDiffY = blurOffsetY - baseOffsetY;

    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // shadow point
    const devicePixelRatio = $getDevicePixelRatio();
    const radian = angle * $Deg2Rad;
    const x = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const y = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    // dropShadow canvas
    const w = inner ? baseWidth  : blurWidth  + Math.max(0, Math.abs(x) - offsetDiffX);
    const h = inner ? baseHeight : blurHeight + Math.max(0, Math.abs(y) - offsetDiffY);
    const width  = Math.ceil(w);
    const height = Math.ceil(h);
    const fractionX = (width  - w) / 2;
    const fractionY = (height - h) / 2;

    const baseTextureX = inner ? 0 : Math.max(0, offsetDiffX - x) + fractionX;
    const baseTextureY = inner ? 0 : Math.max(0, offsetDiffY - y) + fractionY;
    const blurTextureX = inner ? x - blurOffsetX : (x > 0 ? Math.max(0, x - offsetDiffX) : 0) + fractionX;
    const blurTextureY = inner ? y - blurOffsetY : (y > 0 ? Math.max(0, y - offsetDiffY) : 0) + fractionY;

    let typeName: string = "";
    let knockoutState: boolean;
    if (inner) {
        typeName = "inner";
        knockoutState = knockout || hide_object;
    } else if (!knockout && hide_object) {
        typeName = "full";
        knockoutState = true;
    } else {
        typeName = "outer";
        knockoutState = knockout;
    }

    const textureObject = filterApplyBitmapFilterUseCase(
        texture_object, blurTextureObject, width, height,
        baseWidth, baseHeight, baseTextureX, baseTextureY,
        blurWidth, blurHeight, blurTextureX, blurTextureY,
        true, typeName, knockoutState,
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