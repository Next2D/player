/**
 * @description グラデーションLUTテクスチャ生成
 *              Gradient LUT texture generator
 */

/**
 * @description ストップ数に応じた適応解像度を取得する
 *              Get adaptive resolution based on the number of gradient stops
 *
 * @param  {number} stops_length - ストップ数 / Number of gradient stops
 * @return {number} 解像度 (256, 512, or 1024) / Resolution
 * @method
 * @protected
 */
export const getAdaptiveResolution = (stops_length: number): number =>
{
    if (stops_length <= 4) {
        return 256;
    }
    if (stops_length <= 8) {
        return 512;
    }
    return 1024;
};

/**
 * @description グラデーションLUTテクスチャデータを生成する
 *              Generate gradient LUT texture data.
 *              stops配列: [offset, R, G, B, A, offset, R, G, B, A, ...]
 *              注意: R, G, B, A は 0-255 範囲
 *              LUTは0-1の範囲の色を生成し、spread処理はシェーダー側で行う
 *
 * @param  {number[]} stops - グラデーションストップ配列 / Gradient stop array
 * @param  {number} _spread - スプレッドメソッド（未使用、シェーダー側で処理）/ Spread method (unused, handled by shader)
 * @param  {number} interpolation - 補間方法 (0: linearRGB, 1: RGB) / Interpolation method (WebGL compatible)
 * @return {Uint8Array} LUTテクスチャデータ / LUT texture data
 * @method
 * @protected
 */
export const generateGradientLUT = (
    stops: number[],
    _spread: number,
    interpolation: number
): Uint8Array =>
{
    // ストップ数を計算（5要素ずつ: offset, R, G, B, A）
    const stopsLength = stops.length / 5;
    const resolution = getAdaptiveResolution(stopsLength);

    // RGBA形式のLUTデータを作成
    const lutData = new Uint8Array(resolution * 4);

    // 各ピクセルの色を補間
    // spread処理はシェーダー側で行うため、LUTは単純に0-1の範囲を生成
    for (let i = 0; i < resolution; i++) {
        const t = i / (resolution - 1);

        // 色を補間（色は0-255範囲で返される）
        const color = $interpolateColor(stops, t, interpolation);

        // WebGL版と同じ: プリマルチプライドアルファは適用しない
        // LUTにはストレート（非プリマルチプライド）の色を格納
        // プリマルチプライドはシェーダー側でサンプリング後に行う
        // これにより、線形補間時に正しい色が得られる

        // LUTデータに書き込み（非プリマルチプライド）
        const offset = i * 4;
        lutData[offset + 0] = Math.round(Math.max(0, Math.min(255, color.r)));
        lutData[offset + 1] = Math.round(Math.max(0, Math.min(255, color.g)));
        lutData[offset + 2] = Math.round(Math.max(0, Math.min(255, color.b)));
        lutData[offset + 3] = Math.round(Math.max(0, Math.min(255, color.a)));
    }

    return lutData;
};

/**
 * @description 色を補間する
 *              Interpolate color between gradient stops.
 *              色は0-255範囲で入力され、0-255範囲で出力される
 *              Colors are input in 0-255 range and output in 0-255 range.
 *
 * @param  {number[]} stops - グラデーションストップ配列 / Gradient stop array
 * @param  {number} t - 補間位置 (0-1) / Interpolation position (0-1)
 * @param  {number} interpolation - 補間方法 (0: linearRGB, 1: RGB) / Interpolation method (WebGL compatible)
 * @return {{ r: number, g: number, b: number, a: number }} 補間された色 / Interpolated color
 * @private
 */
const $interpolateColor = (
    stops: number[],
    t: number,
    interpolation: number
): { r: number; g: number; b: number; a: number } =>
{
    const stopsLength = stops.length / 5;

    // 最初と最後のストップを見つける
    let startIdx = 0;
    let endIdx = 0;

    for (let i = 0; i < stopsLength; i++) {
        // offset は既に 0-1 範囲
        const offset = stops[i * 5];
        if (offset <= t) {
            startIdx = i;
        }
        if (offset >= t && endIdx === 0) {
            endIdx = i;
            break;
        }
    }

    // 最後のストップを超えている場合
    if (endIdx === 0) {
        endIdx = stopsLength - 1;
    }

    // 同じストップの場合（色は0-255範囲）
    if (startIdx === endIdx) {
        const idx = startIdx * 5;
        return {
            "r": stops[idx + 1],
            "g": stops[idx + 2],
            "b": stops[idx + 3],
            "a": stops[idx + 4]
        };
    }

    // 補間係数を計算（offset は既に 0-1 範囲）
    const startOffset = stops[startIdx * 5];
    const endOffset = stops[endIdx * 5];
    const localT = (t - startOffset) / (endOffset - startOffset);

    // 色を取得（0-255範囲）
    const startR = stops[startIdx * 5 + 1];
    const startG = stops[startIdx * 5 + 2];
    const startB = stops[startIdx * 5 + 3];
    const startA = stops[startIdx * 5 + 4];

    const endR = stops[endIdx * 5 + 1];
    const endG = stops[endIdx * 5 + 2];
    const endB = stops[endIdx * 5 + 3];
    const endA = stops[endIdx * 5 + 4];

    // 補間（WebGL互換: interpolation === 0 がlinearRGB）
    if (interpolation === 0) {
        // linearRGB補間（ガンマ補正）
        // 0-255 → 0-1に正規化してからリニア変換
        return {
            "r": $linearToSRGB($lerp($sRGBToLinear(startR / 255), $sRGBToLinear(endR / 255), localT)) * 255,
            "g": $linearToSRGB($lerp($sRGBToLinear(startG / 255), $sRGBToLinear(endG / 255), localT)) * 255,
            "b": $linearToSRGB($lerp($sRGBToLinear(startB / 255), $sRGBToLinear(endB / 255), localT)) * 255,
            "a": $lerp(startA, endA, localT)
        };
    }

    // RGB補間（リニア、デフォルト）- 0-255範囲でそのまま補間
    return {
        "r": $lerp(startR, endR, localT),
        "g": $lerp(startG, endG, localT),
        "b": $lerp(startB, endB, localT),
        "a": $lerp(startA, endA, localT)
    };
};

/**
 * @description 線形補間を行う
 *              Perform linear interpolation between two values
 *
 * @param  {number} a - 開始値 / Start value
 * @param  {number} b - 終了値 / End value
 * @param  {number} t - 補間係数 (0-1) / Interpolation factor (0-1)
 * @return {number} 補間結果 / Interpolated result
 * @private
 */
const $lerp = (a: number, b: number, t: number): number =>
{
    return a + (b - a) * t;
};

/**
 * @description sRGBからリニア色空間へ変換する（入力: 0-1正規化値）
 *              Convert from sRGB to linear color space (input: 0-1 normalized value).
 *              WebGL版と同じガンマ値 2.23333333 を使用
 *
 * @param  {number} value - sRGB色空間の正規化値 (0-1) / Normalized value in sRGB color space
 * @return {number} リニア色空間の値 / Value in linear color space
 * @private
 */
const $sRGBToLinear = (value: number): number =>
{
    return Math.pow(value, 2.23333333);
};

/**
 * @description リニア色空間からsRGBへ変換する（出力: 0-1正規化値）
 *              Convert from linear color space to sRGB (output: 0-1 normalized value).
 *              WebGL版と同じガンマ値 0.45454545 (= 1/2.2) を使用
 *
 * @param  {number} value - リニア色空間の値 / Value in linear color space
 * @return {number} sRGB色空間の正規化値 / Normalized value in sRGB color space
 * @private
 */
const $linearToSRGB = (value: number): number =>
{
    return Math.pow(value, 0.45454545);
};

/**
 * @description フィルター用グラデーションLUTテクスチャデータを生成する
 *              Generate gradient LUT texture data for filters.
 *              ratios, colors, alphas配列から1D LUTを生成
 *
 * @param  {Float32Array} ratios - 比率配列 (0-255) / Ratio array (0-255)
 * @param  {Float32Array} colors - 色配列 (32bit整数) / Color array (32-bit integers)
 * @param  {Float32Array} alphas - アルファ配列 (0-1) / Alpha array (0-1)
 * @return {Uint8Array} LUTテクスチャデータ / LUT texture data
 * @method
 * @protected
 */
export const generateFilterGradientLUT = (
    ratios: Float32Array,
    colors: Float32Array,
    alphas: Float32Array
): Uint8Array =>
{
    const resolution = 256;
    const lutData = new Uint8Array(resolution * 4);
    const stopsLength = ratios.length;

    // ストップデータを構築
    const stops: Array<{ offset: number; r: number; g: number; b: number; a: number }> = [];
    for (let i = 0; i < stopsLength; i++) {
        const color = colors[i];
        stops.push({
            "offset": ratios[i] / 255,
            "r": (color >> 16 & 0xFF) / 255,
            "g": (color >> 8 & 0xFF) / 255,
            "b": (color & 0xFF) / 255,
            "a": alphas[i]
        });
    }

    // 各ピクセルの色を補間
    for (let i = 0; i < resolution; i++) {
        const t = i / (resolution - 1);

        // ストップを見つける
        let startIdx = 0;
        let endIdx = stopsLength - 1;

        for (let j = 0; j < stopsLength - 1; j++) {
            if (stops[j].offset <= t && stops[j + 1].offset >= t) {
                startIdx = j;
                endIdx = j + 1;
                break;
            }
        }

        // 補間
        const start = stops[startIdx];
        const end = stops[endIdx];
        let localT = 0;
        if (end.offset !== start.offset) {
            localT = (t - start.offset) / (end.offset - start.offset);
        }

        const r = $lerp(start.r, end.r, localT);
        const g = $lerp(start.g, end.g, localT);
        const b = $lerp(start.b, end.b, localT);
        const a = $lerp(start.a, end.a, localT);

        // プリマルチプライドアルファで書き込み
        const offset = i * 4;
        lutData[offset + 0] = Math.round(r * a * 255);
        lutData[offset + 1] = Math.round(g * a * 255);
        lutData[offset + 2] = Math.round(b * a * 255);
        lutData[offset + 3] = Math.round(a * 255);
    }

    return lutData;
};
