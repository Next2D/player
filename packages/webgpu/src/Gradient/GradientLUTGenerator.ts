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
 *              新しいグラデーションが初めて出るたびに (キャッシュに無いたびに) 256〜1024 画素ぶん
 *              走るので、1 画素ごとにオブジェクトを作らず、ストップの検索もやり直さない。
 *              位置 t は画素とともに増えるので、「t 以上の位置を持つ最初のストップ」は後ろへしか
 *              動かない。区間が変わったときだけ、その区間の両端の色を用意する。
 *              結果は、画素ごとにストップを先頭から検索する方法と同じ。
 *
 *              This runs over 256 to 1024 texels every time a gradient misses the cache, so it
 *              allocates nothing per texel and never restarts the stop search: t grows with the
 *              texel index, so the first stop at or after t only moves forward, and the end colors
 *              of a segment are prepared only when the segment changes. The result equals searching
 *              the stops from the start for every texel.
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
    const resolution  = getAdaptiveResolution(stopsLength);

    // RGBA形式のLUTデータを作成
    const lutData = new Uint8Array(resolution * 4);
    if (stopsLength < 1) {
        return lutData;
    }

    // WebGL互換: interpolation === 0 がlinearRGB
    const linear = interpolation === 0;
    const scale  = resolution - 1;
    const last   = (stopsLength - 1) * 5;

    // t 以上の位置を持つ最初のストップ (無ければ stopsLength)
    let end = 0;

    // 色を用意済みの区間 (end の値) と、その両端
    let segment = -1;
    let offset  = 0;
    let span    = 0;
    let r0 = 0, g0 = 0, b0 = 0, a0 = 0;
    let r1 = 0, g1 = 0, b1 = 0, a1 = 0;

    // spread処理はシェーダー側で行うため、LUTは単純に0-1の範囲を生成
    for (let i = 0; i < resolution; i++) {

        const t = i / scale;

        while (end < stopsLength && !(stops[end * 5] >= t)) {
            end++;
        }

        // 色は0-255範囲
        let r: number, g: number, b: number, a: number;
        if (end >= stopsLength) {

            // 最後のストップを超えている
            r = stops[last + 1];
            g = stops[last + 2];
            b = stops[last + 3];
            a = stops[last + 4];

        } else if (end === 0 || stops[end * 5] === t) {

            // 最初のストップより手前、またはストップの位置そのもの
            const index = end * 5;
            r = stops[index + 1];
            g = stops[index + 2];
            b = stops[index + 3];
            a = stops[index + 4];

        } else {

            if (segment !== end) {
                segment = end;

                const from = end * 5 - 5;
                const to   = end * 5;

                // offset は既に 0-1 範囲
                offset = stops[from];
                span   = stops[to] - offset;

                if (linear) {
                    // linearRGB補間（ガンマ補正）: 0-255 → 0-1に正規化してからリニア変換
                    // WebGL版と同じガンマ値 2.23333333 を使用
                    r0 = Math.pow(stops[from + 1] / 255, 2.23333333);
                    g0 = Math.pow(stops[from + 2] / 255, 2.23333333);
                    b0 = Math.pow(stops[from + 3] / 255, 2.23333333);
                    r1 = Math.pow(stops[to + 1] / 255, 2.23333333);
                    g1 = Math.pow(stops[to + 2] / 255, 2.23333333);
                    b1 = Math.pow(stops[to + 3] / 255, 2.23333333);
                } else {
                    r0 = stops[from + 1];
                    g0 = stops[from + 2];
                    b0 = stops[from + 3];
                    r1 = stops[to + 1];
                    g1 = stops[to + 2];
                    b1 = stops[to + 3];
                }
                a0 = stops[from + 4];
                a1 = stops[to + 4];
            }

            const localT = (t - offset) / span;
            if (linear) {
                // リニア色空間で補間してから sRGB へ戻す (WebGL版と同じガンマ値 0.45454545)
                r = Math.pow(r0 + (r1 - r0) * localT, 0.45454545) * 255;
                g = Math.pow(g0 + (g1 - g0) * localT, 0.45454545) * 255;
                b = Math.pow(b0 + (b1 - b0) * localT, 0.45454545) * 255;
            } else {
                // RGB補間（リニア、デフォルト）- 0-255範囲でそのまま補間
                r = r0 + (r1 - r0) * localT;
                g = g0 + (g1 - g0) * localT;
                b = b0 + (b1 - b0) * localT;
            }
            a = a0 + (a1 - a0) * localT;
        }

        // WebGL版と同じ: プリマルチプライドアルファは適用しない
        // LUTにはストレート（非プリマルチプライド）の色を格納
        // プリマルチプライドはシェーダー側でサンプリング後に行う
        // これにより、線形補間時に正しい色が得られる

        // 0-255 に収めて四捨五入する (非数は 0)
        const index = i * 4;
        lutData[index]     = r > 0 ? r < 255 ? r + 0.5 | 0 : 255 : 0;
        lutData[index + 1] = g > 0 ? g < 255 ? g + 0.5 | 0 : 255 : 0;
        lutData[index + 2] = b > 0 ? b < 255 ? b + 0.5 | 0 : 255 : 0;
        lutData[index + 3] = a > 0 ? a < 255 ? a + 0.5 | 0 : 255 : 0;
    }

    return lutData;
};

/**
 * @description フィルター用グラデーションLUTテクスチャデータを生成する
 *              Generate gradient LUT texture data for filters.
 *              ratios, colors, alphas配列から1D LUTを生成
 *
 *              1 画素ごと、1 ストップごとのオブジェクトは作らない。区間が変わったときだけ、
 *              その区間の両端の色を用意する。
 *              No object is allocated per texel or per stop; the end colors of a segment are
 *              prepared only when the segment changes.
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
    const resolution  = 256;
    const lutData     = new Uint8Array(resolution * 4);
    const stopsLength = ratios.length;
    const scale       = resolution - 1;

    // 色を用意済みの区間と、その両端 (色は 0-1 範囲)
    let segmentStart = -1;
    let segmentEnd   = -1;
    let offset = 0;
    let span   = 0;
    let r0 = 0, g0 = 0, b0 = 0, a0 = 0;
    let r1 = 0, g1 = 0, b1 = 0, a1 = 0;

    // 各ピクセルの色を補間
    for (let i = 0; i < resolution; i++) {

        const t = i / scale;

        // ストップを見つける
        let startIdx = 0;
        let endIdx   = stopsLength - 1;

        for (let j = 0; j < stopsLength - 1; j++) {
            if (ratios[j] / 255 <= t && ratios[j + 1] / 255 >= t) {
                startIdx = j;
                endIdx   = j + 1;
                break;
            }
        }

        if (segmentStart !== startIdx || segmentEnd !== endIdx) {
            segmentStart = startIdx;
            segmentEnd   = endIdx;

            const startColor = colors[startIdx];
            const endColor   = colors[endIdx];

            offset = ratios[startIdx] / 255;
            span   = ratios[endIdx] / 255 - offset;

            r0 = (startColor >> 16 & 0xFF) / 255;
            g0 = (startColor >> 8 & 0xFF) / 255;
            b0 = (startColor & 0xFF) / 255;
            a0 = alphas[startIdx];

            r1 = (endColor >> 16 & 0xFF) / 255;
            g1 = (endColor >> 8 & 0xFF) / 255;
            b1 = (endColor & 0xFF) / 255;
            a1 = alphas[endIdx];
        }

        // 補間
        const localT = span !== 0 ? (t - offset) / span : 0;

        const r = r0 + (r1 - r0) * localT;
        const g = g0 + (g1 - g0) * localT;
        const b = b0 + (b1 - b0) * localT;
        const a = a0 + (a1 - a0) * localT;

        // プリマルチプライドアルファで書き込み
        const index = i * 4;
        lutData[index]     = Math.round(r * a * 255);
        lutData[index + 1] = Math.round(g * a * 255);
        lutData[index + 2] = Math.round(b * a * 255);
        lutData[index + 3] = Math.round(a * 255);
    }

    return lutData;
};
