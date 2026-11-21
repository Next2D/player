import type { IPoint } from "../../interface/IPoint";
import type { IQuadraticSegment } from "../../interface/IQuadraticSegment";
import { execute as calculateFlatness } from "../service/BezierConverterCalculateFlatnessService";
import { execute as splitCubic } from "../service/BezierConverterSplitCubicService";

export type { IQuadraticSegment };

/**
 * @description フラットネス閾値のデフォルト値
 *              Default flatness threshold (squared distance)
 *
 * この値は曲線がどの程度「平坦」であれば直接近似するかを決定。
 * 値が小さいほど高品質だが分割数が増加。
 * 0.5ピクセル相当の値をデフォルトとする（滑らかなストローク描画用）。
 */
const DEFAULT_FLATNESS_THRESHOLD = 0.25; // 0.5px squared

/**
 * @description 最大再帰深度
 *              Maximum recursion depth to prevent infinite loops
 */
const MAX_RECURSION_DEPTH = 8;

/**
 * @description 3次ベジェ曲線を2次ベジェ曲線で近似するときの、画面上の誤差の許容値 (ピクセル)。WebGL版と同じ。
 *              Allowed on-screen error in pixels when approximating a cubic Bezier curve with quadratic
 *              ones. Same as the WebGL renderer.
 */
const CUBIC_TOLERANCE = 0.05;

/**
 * @description 3次ベジェ曲線 1 本を近似する2次ベジェ曲線の本数の上限。WebGL版と同じ。
 *              Maximum number of quadratic curves per cubic curve. Same as the WebGL renderer.
 */
const MAX_SEGMENTS = 8;

/**
 * @description 3次ベジェ曲線を何本の2次ベジェ曲線で近似するかを、画面上の誤差から求める (WebGL版と同じ式)。
 *              1 本の2次ベジェ曲線 (制御点 = (3 * P1 + 3 * P2 - P0 - P3) / 4) で近似したときの誤差の上限は
 *              √3 / 36 * |P3 - 3 * P2 + 3 * P1 - P0|、n 等分してから近似すると 1 / n³ になる。
 *              Returns how many quadratic curves approximate a cubic one, from the on-screen error
 *              (same formula as the WebGL renderer).
 *
 * @param {IPoint} p0
 * @param {IPoint} p1
 * @param {IPoint} p2
 * @param {IPoint} p3
 * @param {number} pixel_scale - 曲線の座標 1 単位が画面上で何ピクセルになるか
 * @return {number}
 */
export const getCubicSegmentCount = (
    p0: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint,
    pixel_scale: number
): number => {

    const dx = p3.x - 3 * p2.x + 3 * p1.x - p0.x;
    const dy = p3.y - 3 * p2.y + 3 * p1.y - p0.y;

    // √3 / 36 = 0.048112522432468816
    const error = 0.048112522432468816 * Math.sqrt(dx * dx + dy * dy) * pixel_scale;

    let count = 1;
    while (count < MAX_SEGMENTS && error > CUBIC_TOLERANCE * count * count * count) {
        ++count;
    }
    return count;
};

/**
 * @description 三次ベジェ曲線を適応的に二次ベジェ曲線群に変換
 *              Adaptively convert cubic bezier to quadratic bezier segments
 *
 * pixel_scale (曲線の座標 1 単位が画面上で何ピクセルになるか) が渡されたときは、近似の誤差から
 * 必要な本数 (1〜8) を決め、その本数に等分する。直線からの離れ具合 (フラットネス) で再帰的に
 * 分割する方法は、2次曲線で近似したときの誤差と対応せず、小さな曲線でも数十本に分かれる。
 * pixel_scale が無いときは、従来どおりフラットネスで分割する。
 *
 * フラットネス（平坦度）に基づいて動的に分割数を決定。
 * 単純な曲線は少ない分割、複雑な曲線は多い分割を行う。
 *
 * @param {IPoint} p0 - 始点
 * @param {IPoint} p1 - 制御点1
 * @param {IPoint} p2 - 制御点2
 * @param {IPoint} p3 - 終点
 * @param {number} flatness_threshold - フラットネス閾値（オプション）
 * @param {number} pixel_scale - 曲線の座標 1 単位が画面上で何ピクセルになるか（オプション。0 以下なら従来の分割）
 * @return {IQuadraticSegment[]} 二次ベジェ曲線のセグメント配列
 */
export const execute = (
    p0: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint,
    flatness_threshold: number = DEFAULT_FLATNESS_THRESHOLD,
    pixel_scale: number = 0
): IQuadraticSegment[] => {

    const result: IQuadraticSegment[] = [];

    if (pixel_scale > 0) {

        const count = getCubicSegmentCount(p0, p1, p2, p3, pixel_scale);

        // 残りの曲線の先頭 1 / (残りの本数) を切り出すことを繰り返す (De Casteljau)
        let x0 = p0.x;
        let y0 = p0.y;
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        const x3 = p3.x;
        const y3 = p3.y;

        for (let idx = 0; idx < count - 1; ++idx) {

            const t  = 1 / (count - idx);
            const mt = 1 - t;

            const q0x = mt * x0 + t * x1;
            const q0y = mt * y0 + t * y1;
            const q1x = mt * x1 + t * x2;
            const q1y = mt * y1 + t * y2;
            const q2x = mt * x2 + t * x3;
            const q2y = mt * y2 + t * y3;
            const r0x = mt * q0x + t * q1x;
            const r0y = mt * q0y + t * q1y;
            const r1x = mt * q1x + t * q2x;
            const r1y = mt * q1y + t * q2y;
            const sx  = mt * r0x + t * r1x;
            const sy  = mt * r0y + t * r1y;

            // 切り出した区間 (x0, y0) - (q0) - (r0) - (s) を 1 本の2次ベジェ曲線で近似する
            result.push({
                "ctrl": {
                    "x": (3 * q0x + 3 * r0x - x0 - sx) * 0.25,
                    "y": (3 * q0y + 3 * r0y - y0 - sy) * 0.25
                },
                "end": { "x": sx, "y": sy }
            });

            // 残り: (s) - (r1) - (q2) - (x3, y3)
            x0 = sx;
            y0 = sy;
            x1 = r1x;
            y1 = r1y;
            x2 = q2x;
            y2 = q2y;
        }

        result.push({
            "ctrl": {
                "x": (3 * x1 + 3 * x2 - x0 - x3) * 0.25,
                "y": (3 * y1 + 3 * y2 - y0 - y3) * 0.25
            },
            "end": { "x": x3, "y": y3 }
        });

        return result;
    }

    /**
     * @description 再帰的に三次ベジェ曲線を分割し、二次ベジェ曲線に近似する内部関数
     *              Internal recursive function that subdivides cubic bezier and approximates with quadratic bezier
     * @param {IPoint} start - 始点
     * @param {IPoint} ctrl1 - 制御点1
     * @param {IPoint} ctrl2 - 制御点2
     * @param {IPoint} end - 終点
     * @param {number} depth - 現在の再帰深度
     * @return {void}
     */
    const subdivide = (
        start: IPoint,
        ctrl1: IPoint,
        ctrl2: IPoint,
        end: IPoint,
        depth: number
    ): void => {

        // フラットネスを計算
        const flatness = calculateFlatness(start, ctrl1, ctrl2, end);

        // フラットネスが閾値以下、または最大深度に達した場合は近似
        if (flatness <= flatness_threshold || depth >= MAX_RECURSION_DEPTH) {
            // 三次ベジェを二次ベジェに近似
            // WebGL版と同じ: 分割後は単純に2つの制御点の中点を使用
            const ctrl: IPoint = {
                "x": (ctrl1.x + ctrl2.x) * 0.5,
                "y": (ctrl1.y + ctrl2.y) * 0.5
            };

            result.push({
                "ctrl": ctrl,
                "end": end
            });

            return;
        }

        // 曲線を2分割してそれぞれを再帰処理
        const split = splitCubic(start, ctrl1, ctrl2, end);

        subdivide(
            split.first[0],
            split.first[1],
            split.first[2],
            split.first[3],
            depth + 1
        );

        subdivide(
            split.second[0],
            split.second[1],
            split.second[2],
            split.second[3],
            depth + 1
        );
    };

    // 分割を開始
    subdivide(p0, p1, p2, p3, 0);

    return result;
};
