import type { IGradientStop } from "./GradientLUTParseStopsService";

/**
 * @description 2つのストップ間で色を補間
 *              Interpolate color between two stops
 *
 * @param  {IGradientStop} startStop
 * @param  {IGradientStop} endStop
 * @param  {number} t - 補間係数 (0-1)
 * @param  {number} interpolation - 0: RGB, 1: Linear RGB
 * @return {{ r: number, g: number, b: number, a: number }}
 * @method
 * @protected
 */
export const execute = (
    startStop: IGradientStop,
    endStop: IGradientStop,
    t: number,
    interpolation: number
): { r: number; g: number; b: number; a: number } => {

    let r: number;
    let g: number;
    let b: number;

    if (interpolation === 1) {
        // Linear RGB補間（ガンマ補正あり）
        const sr = Math.pow(startStop.r, 2.2);
        const sg = Math.pow(startStop.g, 2.2);
        const sb = Math.pow(startStop.b, 2.2);
        const er = Math.pow(endStop.r, 2.2);
        const eg = Math.pow(endStop.g, 2.2);
        const eb = Math.pow(endStop.b, 2.2);

        r = Math.pow(sr + (er - sr) * t, 1 / 2.2);
        g = Math.pow(sg + (eg - sg) * t, 1 / 2.2);
        b = Math.pow(sb + (eb - sb) * t, 1 / 2.2);
    } else {
        // 通常のRGB補間
        r = startStop.r + (endStop.r - startStop.r) * t;
        g = startStop.g + (endStop.g - startStop.g) * t;
        b = startStop.b + (endStop.b - startStop.b) * t;
    }

    const a = startStop.a + (endStop.a - startStop.a) * t;

    return { r, g, b, a };
};
