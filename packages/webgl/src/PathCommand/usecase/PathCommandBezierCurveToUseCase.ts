import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { execute as pathCommandQuadraticCurveToUseCase } from "./PathCommandQuadraticCurveToUseCase";
import { execute as bezierConverterAdaptiveCubicToQuadUseCase } from "../../BezierConverter/usecase/BezierConverterAdaptiveCubicToQuadUseCase";
import { $currentPath } from "../../PathCommand";
import { $context } from "../../WebGLUtil";
import { $CUBIC_SINGLE_SEGMENT_LIMIT } from "../../BezierConverter";

/**
 * @description 3次ベジェ曲線を描画します。適応的テッセレーションにより曲率に応じた分割を行います。
 *              Draw a cubic Bezier curve. Uses adaptive tessellation based on curvature.
 *
 * @param  {number} cx1
 * @param  {number} cy1
 * @param  {number} cx2
 * @param  {number} cy2
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): void => {

    if (!$currentPath.length) {
        pathCommandMoveToUseCase(0, 0);
    }

    const length = $currentPath.length;
    const fromX: number = +$currentPath[length - 3];
    const fromY: number = +$currentPath[length - 2];

    // 終点が現在の点と同じなら何もしない
    if (x === fromX && y === fromY) {
        return;
    }

    // 曲線の座標 1 単位が画面上で何ピクセルになるか (描画行列の x 軸 / y 軸方向の拡大率の大きい方) の 2 乗。
    // 2次ベジェ曲線で近似するときの本数を、画面上の誤差から決めるのに使う。
    // 描画コンテキストが無い場合 (経路だけを組み立てる場合) は 0 とし、従来の分割数になる。
    let scaleSquared = 0;
    if ($context) {
        const matrix = $context.$matrix;
        const scaleX = matrix[0] * matrix[0] + matrix[1] * matrix[1];
        const scaleY = matrix[3] * matrix[3] + matrix[4] * matrix[4];
        scaleSquared = scaleX > scaleY ? scaleX : scaleY;
    }

    if (scaleSquared > 0) {

        // 1 本の2次ベジェ曲線で足りる場合 (小さな図形の曲線の大半) は、ここで制御点を求めて直接追加する。
        // 画面上の誤差 √3 / 36 * |P3 - 3 * P2 + 3 * P1 - P0| * scale が許容値以内かどうかを、
        // 平方根を取らずに 2 乗どうしで比べる。汎用の経路は曲線 1 本ごとに関数を何段も呼び、
        // 結果を作業用バッファ経由で受け渡すため、曲線の多い図形ではその呼び出しが時間の大半になる。
        // When one quadratic curve is enough (most curves of small shapes), compute the control
        // point here and append it directly, comparing squared values instead of taking square roots.
        const dx = x - 3 * cx2 + 3 * cx1 - fromX;
        const dy = y - 3 * cy2 + 3 * cy1 - fromY;
        if ((dx * dx + dy * dy) * scaleSquared <= $CUBIC_SINGLE_SEGMENT_LIMIT) {
            $currentPath.push(
                (3 * cx1 + 3 * cx2 - fromX - x) * 0.25,
                (3 * cy1 + 3 * cy2 - fromY - y) * 0.25,
                true,
                x, y, false
            );
            return;
        }
    }

    const result = bezierConverterAdaptiveCubicToQuadUseCase(
        fromX, fromY, cx1, cy1, cx2, cy2, x, y,
        scaleSquared > 0 ? Math.sqrt(scaleSquared) : 0
    );
    const buffer = result.buffer;
    const count = result.count;

    for (let idx = 0; idx < count * 4; ) {
        pathCommandQuadraticCurveToUseCase(
            buffer[idx++],
            buffer[idx++],
            buffer[idx++],
            buffer[idx++]
        );
    }
};