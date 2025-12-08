/**
 * @description グラデーションLUTテクスチャ生成
 *              Gradient LUT texture generator
 */

/**
 * @description ストップ数に応じた適応解像度を取得
 * @param {number} stopsLength
 * @return {number}
 */
export const getAdaptiveResolution = (stopsLength: number): number =>
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
 * @description グラデーションLUTテクスチャデータを生成
 *              stops配列: [offset, R, G, B, A, offset, R, G, B, A, ...]
 * @param {number[]} stops - グラデーションストップ配列
 * @param {number} spread - スプレッドメソッド (0: pad, 1: reflect, 2: repeat)
 * @param {number} interpolation - 補間方法 (0: RGB, 1: linearRGB)
 * @return {Uint8Array}
 */
export const generateGradientLUT = (
    stops: number[],
    spread: number,
    interpolation: number
): Uint8Array =>
{
    // ストップ数を計算（5要素ずつ: offset, R, G, B, A）
    const stopsLength = stops.length / 5;
    const resolution = getAdaptiveResolution(stopsLength);

    // RGBA形式のLUTデータを作成
    const lutData = new Uint8Array(resolution * 4);

    // 各ピクセルの色を補間
    for (let i = 0; i < resolution; i++) {
        let t = i / (resolution - 1);

        // スプレッドメソッドを適用
        t = applySpread(t, spread);

        // 色を補間
        const color = interpolateColor(stops, t, interpolation);

        // LUTデータに書き込み
        const offset = i * 4;
        lutData[offset + 0] = Math.round(color.r * 255);
        lutData[offset + 1] = Math.round(color.g * 255);
        lutData[offset + 2] = Math.round(color.b * 255);
        lutData[offset + 3] = Math.round(color.a * 255);
    }

    return lutData;
};

/**
 * @description スプレッドメソッドを適用
 * @param {number} t
 * @param {number} spread
 * @return {number}
 */
const applySpread = (t: number, spread: number): number =>
{
    switch (spread) {
        case 0: // pad
            return Math.max(0, Math.min(1, t));
        case 1: // reflect
            return 1 - Math.abs((t % 2) - 1);
        case 2: // repeat
            return t - Math.floor(t);
        default:
            return Math.max(0, Math.min(1, t));
    }
};

/**
 * @description 色を補間
 * @param {number[]} stops
 * @param {number} t
 * @param {number} interpolation
 * @return {{ r: number, g: number, b: number, a: number }}
 */
const interpolateColor = (
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

    // 同じストップの場合
    if (startIdx === endIdx) {
        const idx = startIdx * 5;
        return {
            r: stops[idx + 1],
            g: stops[idx + 2],
            b: stops[idx + 3],
            a: stops[idx + 4]
        };
    }

    // 補間係数を計算
    const startOffset = stops[startIdx * 5];
    const endOffset = stops[endIdx * 5];
    const localT = (t - startOffset) / (endOffset - startOffset);

    // 色を取得
    const startR = stops[startIdx * 5 + 1];
    const startG = stops[startIdx * 5 + 2];
    const startB = stops[startIdx * 5 + 3];
    const startA = stops[startIdx * 5 + 4];

    const endR = stops[endIdx * 5 + 1];
    const endG = stops[endIdx * 5 + 2];
    const endB = stops[endIdx * 5 + 3];
    const endA = stops[endIdx * 5 + 4];

    // 補間
    if (interpolation === 1) {
        // linearRGB補間（ガンマ補正）
        return {
            r: linearToSRGB(lerp(sRGBToLinear(startR), sRGBToLinear(endR), localT)),
            g: linearToSRGB(lerp(sRGBToLinear(startG), sRGBToLinear(endG), localT)),
            b: linearToSRGB(lerp(sRGBToLinear(startB), sRGBToLinear(endB), localT)),
            a: lerp(startA, endA, localT)
        };
    }

    // RGB補間（リニア）
    return {
        r: lerp(startR, endR, localT),
        g: lerp(startG, endG, localT),
        b: lerp(startB, endB, localT),
        a: lerp(startA, endA, localT)
    };
};

/**
 * @description 線形補間
 */
const lerp = (a: number, b: number, t: number): number =>
{
    return a + (b - a) * t;
};

/**
 * @description sRGBからリニアへ変換
 */
const sRGBToLinear = (value: number): number =>
{
    return Math.pow(value, 2.2);
};

/**
 * @description リニアからsRGBへ変換
 */
const linearToSRGB = (value: number): number =>
{
    return Math.pow(value, 1 / 2.2);
};

/**
 * @description フィルター用グラデーションLUTテクスチャデータを生成
 *              ratios, colors, alphas配列から1D LUTを生成
 * @param {Float32Array} ratios - 比率配列 (0-255)
 * @param {Float32Array} colors - 色配列 (32bit整数)
 * @param {Float32Array} alphas - アルファ配列 (0-1)
 * @return {Uint8Array}
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
            offset: ratios[i] / 255,
            r: ((color >> 16) & 0xFF) / 255,
            g: ((color >> 8) & 0xFF) / 255,
            b: (color & 0xFF) / 255,
            a: alphas[i]
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

        const r = lerp(start.r, end.r, localT);
        const g = lerp(start.g, end.g, localT);
        const b = lerp(start.b, end.b, localT);
        const a = lerp(start.a, end.a, localT);

        // プリマルチプライドアルファで書き込み
        const offset = i * 4;
        lutData[offset + 0] = Math.round(r * a * 255);
        lutData[offset + 1] = Math.round(g * a * 255);
        lutData[offset + 2] = Math.round(b * a * 255);
        lutData[offset + 3] = Math.round(a * 255);
    }

    return lutData;
};
