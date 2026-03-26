/**
 * @description ブラーフィルター適用のユースケース
 *              Apply blur filter use case
 */

/**
 * @description ブラー計算用のステップ値
 *              Step values for blur calculation
 * @type {number[]}
 */
const $BLUR_STEP: number[] = [0.5, 1.05, 1.4, 1.55, 1.75, 1.9, 2, 2.15, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];

/**
 * @description ブラーフィルターパラメータを計算
 *              Calculate blur filter parameters
 *
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} blur_x - X方向のブラー量
 * @param  {number} blur_y - Y方向のブラー量
 * @param  {number} quality - クオリティ (1-15)
 * @param  {number} device_pixel_ratio - デバイスピクセル比
 * @return {object}
 */
export const calculateBlurParams = (
    matrix: Float32Array,
    blur_x: number,
    blur_y: number,
    quality: number,
    device_pixel_ratio: number
): {
    baseBlurX: number;
    baseBlurY: number;
    offsetX: number;
    offsetY: number;
    bufferScaleX: number;
    bufferScaleY: number;
} => {
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    const baseBlurX = blur_x * (xScale / device_pixel_ratio);
    const baseBlurY = blur_y * (yScale / device_pixel_ratio);

    const step = $BLUR_STEP[Math.min(quality - 1, $BLUR_STEP.length - 1)];
    const offsetX = Math.round(baseBlurX * step);
    const offsetY = Math.round(baseBlurY * step);

    // バッファスケールを計算（大きなブラーの場合はダウンスケール）
    let bufferScaleX = 1;
    let bufferScaleY = 1;

    if (baseBlurX > 128) {
        bufferScaleX = 0.0625;
    } else if (baseBlurX > 64) {
        bufferScaleX = 0.125;
    } else if (baseBlurX > 32) {
        bufferScaleX = 0.25;
    } else if (baseBlurX > 16) {
        bufferScaleX = 0.5;
    }

    if (baseBlurY > 128) {
        bufferScaleY = 0.0625;
    } else if (baseBlurY > 64) {
        bufferScaleY = 0.125;
    } else if (baseBlurY > 32) {
        bufferScaleY = 0.25;
    } else if (baseBlurY > 16) {
        bufferScaleY = 0.5;
    }

    return {
        baseBlurX,
        baseBlurY,
        offsetX,
        offsetY,
        bufferScaleX,
        bufferScaleY
    };
};

/**
 * @description 方向ブラーのパラメータを計算
 *              Calculate directional blur parameters
 *
 * @param  {boolean} is_horizontal - 水平方向かどうか
 * @param  {number} blur - ブラー量
 * @param  {number} texture_width - テクスチャ幅
 * @param  {number} texture_height - テクスチャ高さ
 * @return {object}
 */
export const calculateDirectionalBlurParams = (
    is_horizontal: boolean,
    blur: number,
    texture_width: number,
    texture_height: number
): {
    offsetX: number;
    offsetY: number;
    fraction: number;
    samples: number;
    halfBlur: number;
} => {
    const halfBlur = Math.ceil(blur * 0.5);
    const fraction = 1 - (halfBlur - blur * 0.5);
    const samples = 1 + blur;

    // テクセルオフセットを計算
    const offsetX = is_horizontal ? 1 / texture_width : 0;
    const offsetY = is_horizontal ? 0 : 1 / texture_height;

    return {
        offsetX,
        offsetY,
        fraction,
        samples,
        halfBlur
    };
};
