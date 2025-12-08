/**
 * @description グラデーションストップの型定義
 *              Gradient stop type definition
 */
export interface IGradientStop {
    ratio: number;
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * @description グラデーションストップ配列をパースしてソート
 *              Parse and sort gradient stops array
 *
 * @param  {number[]} stops - [ratio, r, g, b, a, ratio, r, g, b, a, ...]
 * @return {IGradientStop[]}
 * @method
 * @protected
 */
export const execute = (stops: number[]): IGradientStop[] =>
{
    const gradientStops: IGradientStop[] = [];

    for (let i = 0; i < stops.length; i += 5) {
        gradientStops.push({
            ratio: stops[i],
            r: stops[i + 1],
            g: stops[i + 2],
            b: stops[i + 3],
            a: stops[i + 4]
        });
    }

    // ストップポイントをratio順にソート
    gradientStops.sort((a, b) => a.ratio - b.ratio);

    return gradientStops;
};
