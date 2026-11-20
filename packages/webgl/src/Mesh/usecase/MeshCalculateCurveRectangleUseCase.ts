import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";

/**
 * @description 2次ベジェ曲線を半分に分割する回数。分割後の区間数は 2 の SPLIT_COUNT 乗。
 *              Number of times a quadratic Bezier curve is halved. The curve ends up in 2 ** SPLIT_COUNT segments.
 *
 * @type {number}
 * @const
 */
const SPLIT_COUNT: number = 5;

/**
 * @description 分割後の区間数
 *              Number of segments after splitting
 *
 * @type {number}
 * @const
 */
const SEGMENT_COUNT: number = 1 << SPLIT_COUNT;

/**
 * @description 分割中の区間 (1区間 = 始点・制御点・終点の x, y で 6 要素)。2 本を交互に使う。
 *              Segments being split (six values per segment: x, y of the start, control and end points).
 *              The two buffers are used alternately.
 *
 * @type {Float64Array}
 * @private
 */
let $segments: Float64Array = new Float64Array(SEGMENT_COUNT * 6);
let $nextSegments: Float64Array = new Float64Array(SEGMENT_COUNT * 6);

/**
 * @description 右側の輪郭の点 (1区間 = t=0, 0.5, 1 の x, y で 6 要素)。逆順に並べるため一旦ためる。
 *              Points of the right outline (six values per segment: x, y at t = 0, 0.5 and 1).
 *              Kept until the end because they are emitted in reverse order.
 *
 * @type {Float64Array}
 * @private
 */
const $rightPoints: Float64Array = new Float64Array(SEGMENT_COUNT * 6);

/**
 * @description $offsetPoint の結果
 *              Result of $offsetPoint
 *
 * @type {number}
 * @private
 */
let $offsetX: number = 0;
let $offsetY: number = 0;

/**
 * @description 2次ベジェ曲線上の t の点を、法線方向へ offset だけずらした点を $offsetX / $offsetY に求める。
 *              (MeshGetQuadraticBezierPointService / MeshGetQuadraticBezierTangentService /
 *               MeshCalculateNormalizeBezierService と同じ計算を、オブジェクトを作らずに行う)
 *              Computes into $offsetX / $offsetY the point at t on a quadratic Bezier curve, moved by
 *              offset along the normal. Same arithmetic as the three services above, without allocating objects.
 *
 * @param  {number} t
 * @param  {number} x0
 * @param  {number} y0
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @param  {number} offset
 * @return {void}
 * @method
 * @private
 */
const $offsetPoint = (
    t: number,
    x0: number, y0: number,
    x1: number, y1: number,
    x2: number, y2: number,
    offset: number
): void => {

    const positionX = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2;
    const positionY = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2;

    const tangentX = 2 * (1 - t) * (x1 - x0) + 2 * t * (x2 - x1);
    const tangentY = 2 * (1 - t) * (y1 - y0) + 2 * t * (y2 - y1);

    // 接線を 90 度回した法線を正規化する
    const normalX = -tangentY;
    const normalY = tangentX;
    const length  = Math.sqrt(normalX * normalX + normalY * normalY);
    if (length === 0) {
        $offsetX = positionX + 0 * offset;
        $offsetY = positionY + 0 * offset;
    } else {
        $offsetX = positionX + normalX / length * offset;
        $offsetY = positionY + normalY / length * offset;
    }
};

/**
 * @description カーブの矩形を計算する
 *              Calculate curve rectangle
 *
 *              曲線を 32 区間に分割し、各区間を左右へ thickness だけずらした輪郭を返す。
 *              線の輪郭は図形を初めて描くときに曲線ごとに計算されるため、点や区間ごとに
 *              オブジェクトや配列を作ると、その確保と回収が描画の停止として現れる。
 *              ここでは作業領域を使い回し、結果の配列だけを作る。
 *
 *              Splits the curve into 32 segments and returns the outline offset by thickness on both sides.
 *              Outlines are computed per curve the first time a shape is drawn, so allocating an object or
 *              an array per point or segment shows up as a stall. Work buffers are reused here and only
 *              the result array is allocated.
 *
 * @param  {IPoint} start_point
 * @param  {IPoint} control_point
 * @param  {IPoint} end_point
 * @param  {number} thickness
 * @return {IPath}
 * @memthod
 * @protected
 */
export const execute = (
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint,
    thickness: number
): IPath => {

    // 曲線を半分に分割することを SPLIT_COUNT 回繰り返す (De Casteljau、t = 0.5)
    let segments = $segments;
    let nextSegments = $nextSegments;
    segments[0] = start_point.x;
    segments[1] = start_point.y;
    segments[2] = control_point.x;
    segments[3] = control_point.y;
    segments[4] = end_point.x;
    segments[5] = end_point.y;

    let count = 1;
    for (let split = 0; split < SPLIT_COUNT; ++split) {
        for (let idx = 0; idx < count; ++idx) {
            const source = idx * 6;
            const x0 = segments[source];
            const y0 = segments[source + 1];
            const x1 = segments[source + 2];
            const y1 = segments[source + 3];
            const x2 = segments[source + 4];
            const y2 = segments[source + 5];

            const m0x  = x0 + (x1 - x0) * 0.5;
            const m0y  = y0 + (y1 - y0) * 0.5;
            const m1x  = x1 + (x2 - x1) * 0.5;
            const m1y  = y1 + (y2 - y1) * 0.5;
            const m01x = m0x + (m1x - m0x) * 0.5;
            const m01y = m0y + (m1y - m0y) * 0.5;

            const target = idx * 12;
            nextSegments[target]      = x0;
            nextSegments[target + 1]  = y0;
            nextSegments[target + 2]  = m0x;
            nextSegments[target + 3]  = m0y;
            nextSegments[target + 4]  = m01x;
            nextSegments[target + 5]  = m01y;
            nextSegments[target + 6]  = m01x;
            nextSegments[target + 7]  = m01y;
            nextSegments[target + 8]  = m1x;
            nextSegments[target + 9]  = m1y;
            nextSegments[target + 10] = x2;
            nextSegments[target + 11] = y2;
        }
        const swap = segments;
        segments = nextSegments;
        nextSegments = swap;
        count *= 2;
    }
    $segments = segments;
    $nextSegments = nextSegments;

    // 左側の輪郭: 最初の区間の始点、続けて各区間の中間点 (制御点) と終点
    $offsetPoint(
        0,
        segments[0], segments[1], segments[2], segments[3], segments[4], segments[5],
        +thickness
    );
    const paths: IPath = [$offsetX, $offsetY, false];

    const rightPoints = $rightPoints;
    for (let idx = 0; idx < count; ++idx) {
        const source = idx * 6;
        const x0 = segments[source];
        const y0 = segments[source + 1];
        const x1 = segments[source + 2];
        const y1 = segments[source + 3];
        const x2 = segments[source + 4];
        const y2 = segments[source + 5];

        $offsetPoint(0.5, x0, y0, x1, y1, x2, y2, +thickness);
        const controlX = $offsetX;
        const controlY = $offsetY;
        $offsetPoint(1, x0, y0, x1, y1, x2, y2, +thickness);
        paths.push(
            controlX, controlY, true,
            $offsetX, $offsetY, false
        );

        // 右側の輪郭は逆順に出力するので、ここではためておく
        $offsetPoint(0, x0, y0, x1, y1, x2, y2, -thickness);
        rightPoints[source]     = $offsetX;
        rightPoints[source + 1] = $offsetY;
        $offsetPoint(0.5, x0, y0, x1, y1, x2, y2, -thickness);
        rightPoints[source + 2] = $offsetX;
        rightPoints[source + 3] = $offsetY;
        if (idx === count - 1) {
            $offsetPoint(1, x0, y0, x1, y1, x2, y2, -thickness);
            rightPoints[source + 4] = $offsetX;
            rightPoints[source + 5] = $offsetY;
        }
    }

    // 右側の輪郭: 最後の区間の終点から始め、区間を逆順に (中間点、始点) とたどる
    const last = (count - 1) * 6;
    paths.push(rightPoints[last + 4], rightPoints[last + 5], false);
    for (let idx = count - 1; idx >= 0; --idx) {
        const source = idx * 6;
        paths.push(
            rightPoints[source + 2], rightPoints[source + 3], true,
            rightPoints[source], rightPoints[source + 1], false
        );
    }

    return paths;
};
