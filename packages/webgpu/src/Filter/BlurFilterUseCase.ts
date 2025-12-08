/**
 * @description ブラーフィルター適用のユースケース
 *              Apply blur filter use case
 */

/**
 * @description ブラー計算用のステップ値
 *              Step values for blur calculation
 */
const BLUR_STEP: number[] = [0.5, 1.05, 1.4, 1.55, 1.75, 1.9, 2, 2.15, 2.2, 2.3, 2.5, 3, 3, 3.5, 3.5];

/**
 * @description ブラーフィルターパラメータを計算
 * @param {Float32Array} matrix - 変換行列
 * @param {number} blurX - X方向のブラー量
 * @param {number} blurY - Y方向のブラー量
 * @param {number} quality - クオリティ (1-15)
 * @param {number} devicePixelRatio - デバイスピクセル比
 * @return {object}
 */
export const calculateBlurParams = (
    matrix: Float32Array,
    blurX: number,
    blurY: number,
    quality: number,
    devicePixelRatio: number
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

    const baseBlurX = blurX * (xScale / devicePixelRatio);
    const baseBlurY = blurY * (yScale / devicePixelRatio);

    const step = BLUR_STEP[Math.min(quality - 1, BLUR_STEP.length - 1)];
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
 * @param {boolean} isHorizontal - 水平方向かどうか
 * @param {number} blur - ブラー量
 * @param {number} textureWidth - テクスチャ幅
 * @param {number} textureHeight - テクスチャ高さ
 * @return {object}
 */
export const calculateDirectionalBlurParams = (
    isHorizontal: boolean,
    blur: number,
    textureWidth: number,
    textureHeight: number
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
    const offsetX = isHorizontal ? 1 / textureWidth : 0;
    const offsetY = isHorizontal ? 0 : 1 / textureHeight;

    return {
        offsetX,
        offsetY,
        fraction,
        samples,
        halfBlur
    };
};
