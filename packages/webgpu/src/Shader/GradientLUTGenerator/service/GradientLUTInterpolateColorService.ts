import type { IGradientStop } from "../../../interface/IGradientStop";

/**
 * @description 2つのストップ間で色を補間
 *              Interpolate color between two stops
 *
 * @param  {IGradientStop} start_stop - 開始ストップ
 * @param  {IGradientStop} end_stop - 終了ストップ
 * @param  {number} t - 補間係数 (0-1)
 * @param  {number} interpolation - 0: RGB, 1: Linear RGB
 * @return {{ r: number, g: number, b: number, a: number }}
 * @method
 * @protected
 */
export const execute = (
    start_stop: IGradientStop,
    end_stop: IGradientStop,
    t: number,
    interpolation: number
): { r: number; g: number; b: number; a: number } => {

    let r: number;
    let g: number;
    let b: number;

    if (interpolation === 1) {
        // Linear RGB補間（ガンマ補正あり）
        const sr = Math.pow(start_stop.r, 2.2);
        const sg = Math.pow(start_stop.g, 2.2);
        const sb = Math.pow(start_stop.b, 2.2);
        const er = Math.pow(end_stop.r, 2.2);
        const eg = Math.pow(end_stop.g, 2.2);
        const eb = Math.pow(end_stop.b, 2.2);

        r = Math.pow(sr + (er - sr) * t, 1 / 2.2);
        g = Math.pow(sg + (eg - sg) * t, 1 / 2.2);
        b = Math.pow(sb + (eb - sb) * t, 1 / 2.2);
    } else {
        // 通常のRGB補間
        r = start_stop.r + (end_stop.r - start_stop.r) * t;
        g = start_stop.g + (end_stop.g - start_stop.g) * t;
        b = start_stop.b + (end_stop.b - start_stop.b) * t;
    }

    const a = start_stop.a + (end_stop.a - start_stop.a) * t;

    return { r, g, b, a };
};
