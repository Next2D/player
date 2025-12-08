import { execute as gradientLUTParseStopsService } from "../service/GradientLUTParseStopsService";
import { execute as gradientLUTCalculateResolutionService } from "../service/GradientLUTCalculateResolutionService";
import { execute as gradientLUTGeneratePixelsService } from "../service/GradientLUTGeneratePixelsService";

/**
 * @description グラデーションLUTデータを生成する結果型
 *              Result type for generated gradient LUT data
 */
export interface IGradientLUTData {
    pixels: Uint8Array;
    resolution: number;
}

/**
 * @description グラデーションLUTのピクセルデータを生成
 *              Generate gradient LUT pixel data
 *
 * @param  {number[]} stops - [ratio, r, g, b, a, ratio, r, g, b, a, ...]
 * @param  {number} interpolation - 0: RGB, 1: Linear RGB
 * @param  {number} [minResolution=64] - 最小解像度
 * @param  {number} [maxResolution=512] - 最大解像度
 * @return {IGradientLUTData}
 * @method
 * @protected
 */
export const execute = (
    stops: number[],
    interpolation: number,
    minResolution: number = 64,
    maxResolution: number = 512
): IGradientLUTData => {

    // ストップ配列をパースしてソート
    const parsedStops = gradientLUTParseStopsService(stops);

    // ストップ数に応じた解像度を計算
    const resolution = gradientLUTCalculateResolutionService(
        parsedStops.length,
        minResolution,
        maxResolution
    );

    // ピクセルデータを生成
    const pixels = gradientLUTGeneratePixelsService(
        parsedStops,
        resolution,
        interpolation
    );

    return { pixels, resolution };
};
