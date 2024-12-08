import type { IAttachmentObject } from "../interface/IAttachmentObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";

/**
 * @type {IAttachmentObject | null}
 * @private
 */
let $gradientAttachmentObject: IAttachmentObject | null = null;

/**
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObject = (): IAttachmentObject =>
{
    if (!$gradientAttachmentObject) {
        $gradientAttachmentObject = frameBufferManagerGetAttachmentObjectUseCase(512, 1, false);
    }
    return $gradientAttachmentObject as NonNullable<IAttachmentObject>;
};

/**
 * @type {number}
 * @private
 */
let $maxLength: number = 0;

/**
 * @description 最大長を返却
 *              Returns the maximum length
 *
 * @return {number}
 * @method
 * @protected
 */
export const $getGradientLUTGeneratorMaxLength = (): number =>
{
    return $maxLength;
};

/**
 * @description 最大長を設定
 *              Set the maximum length
 *
 * @param  {WebGL2RenderingContext} gl
 * @return {void}
 * @method
 * @protected
 */
export const $setGradientLUTGeneratorMaxLength = (gl: WebGL2RenderingContext): void =>
{
    $maxLength = Math.floor(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) * 0.75);
};

/**
 * @type {Float32Array}
 * @private
 */
export const $rgbToLinearTable: Float32Array = new Float32Array(256);

/**
 * @type {Float32Array}
 * @private
 */
export const $rgbIdentityTable: Float32Array = new Float32Array(256);

for (let idx = 0; idx < 256; ++idx) {
    const t = idx / 255;
    $rgbToLinearTable[idx] = Math.pow(t, 2.23333333);
    $rgbIdentityTable[idx] = t;
}