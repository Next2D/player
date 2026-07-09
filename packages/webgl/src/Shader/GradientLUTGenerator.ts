import type { IAttachmentObject } from "../interface/IAttachmentObject";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";

/**
 * @description 解像度別のAttachmentObjectキャッシュ
 *              Attachment object cache by resolution
 *
 * @type {Map<number, IAttachmentObject>}
 * @private
 */
const $gradientAttachmentObjects: Map<number, IAttachmentObject> = new Map();

/**
 * @description ストップ数に応じた適応的な解像度を返却
 *              Returns adaptive resolution based on stop count
 *
 * @param  {number} stopsLength
 * @return {number}
 * @method
 * @protected
 */
export const $getAdaptiveResolution = (stopsLength: number): number =>
{
    if (stopsLength <= 4) {
        return 256;
    }
    if (stopsLength <= 8) {
        return 512;
    }
    return 1024;
};

/**
 * @description 指定解像度のAttachmentObjectを返却
 *              Returns AttachmentObject with specified resolution
 *
 * @param  {number} resolution
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObjectWithResolution = (resolution: number): IAttachmentObject =>
{
    if (!$gradientAttachmentObjects.has(resolution)) {
        const attachment = frameBufferManagerGetAttachmentObjectUseCase(resolution, 1, false);
        $gradientAttachmentObjects.set(resolution, attachment);
    }
    return $gradientAttachmentObjects.get(resolution) as NonNullable<IAttachmentObject>;
};

/**
 * @description デフォルトの512解像度のAttachmentObjectを返却（後方互換性）
 *              Returns default 512 resolution AttachmentObject (backward compatibility)
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObject = (): IAttachmentObject =>
{
    return $getGradientAttachmentObjectWithResolution(512);
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