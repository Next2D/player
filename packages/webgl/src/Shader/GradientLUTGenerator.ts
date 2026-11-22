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
 * @description LUT 生成シェーダーを共用するストップ数。これ以下のストップ数のグラデーションは、
 *              すべてこのストップ数用のシェーダーで処理する。
 *
 *              LUT 生成シェーダーはストップ数ごとに別のプログラムになるので、新しいストップ数の
 *              グラデーションが初めて出るたびに、コンパイルとリンクが走る (画面が一瞬止まる)。
 *              足りないストップを最後のストップ (同じ色・同じ位置) で埋めれば、埋めた区間は
 *              通らないので、結果はストップ数ごとのシェーダーと同じになる。
 *
 *              The stop count whose LUT generator shader is shared. Gradients with this many stops
 *              or fewer all use that one shader. The generator is a separate program per stop count,
 *              so a program is compiled and linked whenever a new stop count first appears (a visible
 *              stall). Padding the missing stops with the last stop (same color, same position) never
 *              takes the padded segments, so the result equals the per-count shader's.
 *
 *              8 個にしているのは、シェーダーのコンパイルとリンクの時間がストップ数に対して急に
 *              増えるため (16 個用は 8 個用の数十倍かかるドライバがある)。9 個以上は従来どおり
 *              ストップ数ごとのシェーダーを使う。
 *              It is 8 because compile and link time grows steeply with the stop count (on some
 *              drivers the 16-stop shader takes tens of times longer than the 8-stop one). Nine or
 *              more stops keep using a shader per stop count.
 *
 * @type {number}
 * @const
 */
export const $GRADIENT_LUT_SHARED_STOPS: number = 8;

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