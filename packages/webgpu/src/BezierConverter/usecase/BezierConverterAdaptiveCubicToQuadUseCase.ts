import type { IPoint } from "../../interface/IPoint";
import { execute as calculateFlatness } from "../service/BezierConverterCalculateFlatnessService";
import { execute as splitCubic } from "../service/BezierConverterSplitCubicService";

/**
 * @description 二次ベジェ近似のセグメント
 *              Quadratic bezier segment approximation
 */
export interface IQuadraticSegment {
    ctrl: IPoint;
    end: IPoint;
}

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
 * @param {number} flatnessThreshold - フラットネス閾値（オプション）
 * @return {IQuadraticSegment[]} 二次ベジェ曲線のセグメント配列
 */
export const execute = (
    p0: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint,
    flatnessThreshold: number = DEFAULT_FLATNESS_THRESHOLD
): IQuadraticSegment[] => {

    const result: IQuadraticSegment[] = [];

    // 再帰的に分割を行う内部関数
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
        if (flatness <= flatnessThreshold || depth >= MAX_RECURSION_DEPTH) {
            // 三次ベジェを二次ベジェに近似
            // 始点と終点からの影響も考慮した正確な近似
            // Q(t) ≈ C(t) となるように制御点を調整
            // ctrl = (3 * (P1 + P2) - P0 - P3) / 4
            const ctrl: IPoint = {
                "x": (3 * (ctrl1.x + ctrl2.x) - start.x - end.x) * 0.25,
                "y": (3 * (ctrl1.y + ctrl2.y) - start.y - end.y) * 0.25
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

/**
 * @description スケールに応じたフラットネス閾値を計算
 *              Calculate flatness threshold based on scale
 *
 * ズームレベルが高い場合は高品質な近似が必要。
 * スケール = sqrt(matrix[0]^2 + matrix[1]^2) などで計算可能。
 *
 * @param {number} scale - 現在のスケール
 * @return {number} 調整されたフラットネス閾値
 */
export const calculateAdaptiveThreshold = (scale: number): number => {
    // スケールが大きい場合は閾値を小さくして高品質に
    // スケールが小さい場合は閾値を大きくしてパフォーマンス優先
    const baseThreshold = DEFAULT_FLATNESS_THRESHOLD;

    // スケールの逆数に比例した閾値
    // 最小値と最大値を設定して極端な値を防ぐ
    const adjustedThreshold = baseThreshold / (scale * scale);

    // 閾値の範囲を制限（0.0625〜4.0）
    // 0.0625 = 0.25px squared, 4.0 = 2px squared
    return Math.max(0.0625, Math.min(4.0, adjustedThreshold));
};
