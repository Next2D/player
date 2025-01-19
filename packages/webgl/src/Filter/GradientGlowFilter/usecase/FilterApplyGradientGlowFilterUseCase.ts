import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as filterApplyBlurFilterUseCase } from "../../BlurFilter/usecase/FilterApplyBlurFilterUseCase";
import { execute as filterApplyBitmapFilterUseCase } from "../../BitmapFilter/usecase/FilterApplyBitmapFilterUseCase";
import { execute as textureManagerReleaseTextureObjectUseCase } from "../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase";
import { $offset } from "../../../Filter";
import { $getDevicePixelRatio } from "../../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
const $Deg2Rad: number = Math.PI / 180;

/**
 * @description GradientGlowFilterを適用する
 *              Apply GradientGlowFilter
 *
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @param  {number} distance
 * @param  {number} angle
 * @param  {number[]} colors
 * @param  {number[]} alphas
 * @param  {number[]} ratios
 * @param  {number} blur_x
 * @param  {number} blur_y
 * @param  {number} strength
 * @param  {number} quality
 * @param  {number} type
 * @param  {boolean} knockout
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix: Float32Array,
    distance: number = 4,
    angle: number = 45,
    colors: Float32Array,
    alphas: Float32Array,
    ratios: Float32Array,
    blur_x: number = 4,
    blur_y: number = 4,
    strength: number = 1,
    quality: number = 1,
    type: number = 0,
    knockout: boolean = false
): ITextureObject => {

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

    const isInner = type === 1;
    const w = isInner ? baseWidth  : blurWidth  + Math.max(0, Math.abs(x) - offsetDiffX);
    const h = isInner ? baseHeight : blurHeight + Math.max(0, Math.abs(y) - offsetDiffY);
    const width  = Math.ceil(w);
    const height = Math.ceil(h);
    const fractionX = (width  - w) / 2;
    const fractionY = (height - h) / 2;

    const baseTextureX = isInner ? 0 : Math.max(0, offsetDiffX - x) + fractionX;
    const baseTextureY = isInner ? 0 : Math.max(0, offsetDiffY - y) + fractionY;
    const blurTextureX = isInner ? x - blurOffsetX : (x > 0 ? Math.max(0, x - offsetDiffX) : 0) + fractionX;
    const blurTextureY = isInner ? y - blurOffsetY : (y > 0 ? Math.max(0, y - offsetDiffY) : 0) + fractionY;

    // bevel filter buffer
    let typeName = "";
    switch (type) {

        case 0:
            typeName = "full";
            break;

        case 1:
            typeName = "inner";
            break;

        case 2:
            typeName = "outer";
            break;

    }

    const textureObject = filterApplyBitmapFilterUseCase(
        texture_object, blurTextureObject, width, height,
        baseWidth, baseHeight, baseTextureX, baseTextureY,
        blurWidth, blurHeight, blurTextureX, blurTextureY,
        true, typeName, knockout,
        strength, ratios, colors, alphas,
        0, 0, 0, 0, 0, 0, 0, 0
    );

    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    textureManagerReleaseTextureObjectUseCase(texture_object);
    textureManagerReleaseTextureObjectUseCase(blurTextureObject);

    return textureObject;
};