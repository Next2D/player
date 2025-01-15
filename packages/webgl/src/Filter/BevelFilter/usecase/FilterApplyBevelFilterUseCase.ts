import type { ITextureObject } from "../../../interface/ITextureObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { execute as textureManagerBind0UseCase } from "../../../TextureManager/usecase/TextureManagerBind0UseCase";
import { $offset } from "../../../Filter";
import {
    $getDevicePixelRatio,
    $context
} from "../../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
const $Deg2Rad: number = Math.PI / 180;

/**
 * 
 * @param  {ITextureObject} texture_object
 * @param  {Float32Array} matrix
 * @param  {number} distance
 * @param  {number} angle
 * @param  {number} highlight_color
 * @param  {number} highlight_alpha
 * @param  {number} shadow_color
 * @param  {number} shadow_alpha
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
    highlight_color: number = 0xffffff,
    highlight_alpha: number = 1,
    shadow_color: number = 0,
    shadow_alpha: number = 1,
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

    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // pointer
    const devicePixelRatio = $getDevicePixelRatio();
    const radian = angle * $Deg2Rad;
    const x = Math.cos(radian) * distance * xScale / devicePixelRatio * 2;
    const y = Math.sin(radian) * distance * yScale / devicePixelRatio * 2;

    const currentAttachmentObject = $context.currentAttachmentObject;

    const attachmentObject = frameBufferManagerGetAttachmentObjectUseCase(baseWidth, baseHeight, false);
    $context.bind(attachmentObject);

    textureManagerBind0UseCase(texture_object);

    $context.reset();


    if (currentAttachmentObject) {
        $context.bind(currentAttachmentObject);
    }

    return texture_object;
};