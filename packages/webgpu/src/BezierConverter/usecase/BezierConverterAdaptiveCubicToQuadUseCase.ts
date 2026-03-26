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
 * @description 三次ベジェ曲線を適応的に二次ベジェ曲線群に変換
 *              Adaptively convert cubic bezier to quadratic bezier segments
 *
 * フラットネス（平坦度）に基づいて動的に分割数を決定。
 * 単純な曲線は少ない分割、複雑な曲線は多い分割を行う。
 *
 * @param {IPoint} p0 - 始点
 * @param {IPoint} p1 - 制御点1
 * @param {IPoint} p2 - 制御点2
 * @param {IPoint} p3 - 終点
 * @param {number} flatness_threshold - フラットネス閾値（オプション）
 * @return {IQuadraticSegment[]} 二次ベジェ曲線のセグメント配列
 */
export const execute = (
    p0: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint,
    flatness_threshold: number = DEFAULT_FLATNESS_THRESHOLD
): IQuadraticSegment[] => {

    const result: IQuadraticSegment[] = [];

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
