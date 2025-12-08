import type { IGradientStop } from "./GradientLUTParseStopsService";
import { execute as gradientLUTInterpolateColorService } from "./GradientLUTInterpolateColorService";

/**
 * @description グラデーションLUTのピクセルデータを生成
 *              Generate pixel data for gradient LUT
 *
 * @param  {IGradientStop[]} stops - ソート済みのグラデーションストップ
 * @param  {number} resolution - LUTの解像度（ピクセル数）
 * @param  {number} interpolation - 0: RGB, 1: Linear RGB
 * @return {Uint8Array}
 * @method
 * @protected
 */
export const execute = (
    stops: IGradientStop[],
    resolution: number,
    interpolation: number
): Uint8Array => {

    const pixels = new Uint8Array(resolution * 4);

    if (stops.length === 0) {
        return pixels;
    }

    if (stops.length === 1) {
        // 単一ストップの場合は全体を同じ色で塗る
        const stop = stops[0];
        for (let i = 0; i < resolution; i++) {
            const offset = i * 4;
            pixels[offset] = Math.round(stop.r * 255);
            pixels[offset + 1] = Math.round(stop.g * 255);
            pixels[offset + 2] = Math.round(stop.b * 255);
            pixels[offset + 3] = Math.round(stop.a * 255);
        }
        return pixels;
    }

    for (let i = 0; i < resolution; i++) {

        const ratio = i / (resolution - 1);

        // 該当するストップ区間を見つける
        let startStopIndex = 0;
        for (let j = 0; j < stops.length - 1; j++) {
            if (ratio >= stops[j].ratio && ratio <= stops[j + 1].ratio) {
                startStopIndex = j;
                break;
            }
            if (ratio > stops[j + 1].ratio) {
                startStopIndex = j + 1;
            }
        }

        const startStop = stops[startStopIndex];
        const endStop = stops[Math.min(startStopIndex + 1, stops.length - 1)];

        // 区間内での補間係数を計算
        let t = 0;
        const rangeWidth = endStop.ratio - startStop.ratio;
        if (rangeWidth > 0) {
            t = (ratio - startStop.ratio) / rangeWidth;
            t = Math.max(0, Math.min(1, t));
        }

        // 色を補間
        const color = gradientLUTInterpolateColorService(
            startStop, endStop, t, interpolation
        );

        const offset = i * 4;
        pixels[offset] = Math.round(color.r * 255);
        pixels[offset + 1] = Math.round(color.g * 255);
        pixels[offset + 2] = Math.round(color.b * 255);
        pixels[offset + 3] = Math.round(color.a * 255);
    }

    return pixels;
};
