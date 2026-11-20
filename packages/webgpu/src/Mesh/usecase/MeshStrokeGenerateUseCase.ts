import type { IPoint } from "../../interface/IPoint";
import type { IPath } from "../../interface/IPath";
import { $context } from "../../WebGPUUtil";

/**
 * @description Canvas 2Dコンテキスト（点が矩形内にあるか判定用）
 *              Canvas 2D context for point-in-rectangle testing
 */
const $canvas: OffscreenCanvas = new OffscreenCanvas(1, 1);

/**
 * @description 矩形内の点判定用2Dコンテキスト
 *              2D context used for point-in-path detection
 */
const $canvasContext = $canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

/**
 * @description 再利用可能なPointオブジェクト（GC回避）
 *              Reusable Point objects to avoid GC overhead
 */
const $startPoint: IPoint = { "x": 0, "y": 0 };

/**
 * @description 再利用可能な制御点オブジェクト（GC回避）
 *              Reusable control point object to avoid GC overhead
 */
const $controlPoint: IPoint = { "x": 0, "y": 0 };

/**
 * @description 再利用可能な終了点オブジェクト（GC回避）
 *              Reusable end point object to avoid GC overhead
 */
const $endPoint: IPoint = { "x": 0, "y": 0 };

/**
 * @description 再利用可能な前の点オブジェクト（GC回避）
 *              Reusable previous point object to avoid GC overhead
 */
const $prevPoint: IPoint = { "x": 0, "y": 0 };

/**
 * @description 法線ベクトルを計算（WebGL版のMeshCalculateNormalVectorServiceと同じ）
 *              Calculate the normal vector (same as WebGL MeshCalculateNormalVectorService)
 *
 * @param  {number} x - 方向ベクトルのx成分 / X component of direction vector
 * @param  {number} y - 方向ベクトルのy成分 / Y component of direction vector
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @return {IPoint} 法線ベクトル / Normal vector
 */
const $calculateNormalVector = (x: number, y: number, thickness: number): IPoint =>
{
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude === 0) {
        return { "x": 0, "y": 0 };
    }
    return {
        "x": -(y / magnitude) * thickness,
        "y": x / magnitude * thickness
    };
};

/**
 * @description 2次ベジェ曲線を半分に分割する回数（WebGL版と同じ。分割後は 32 セグメント）
 *              Number of times a quadratic Bezier curve is halved (same as WebGL; 32 segments)
 */
const SPLIT_COUNT: number = 5;

/**
 * @description 分割後のセグメント数
 *              Number of segments after splitting
 */
const SEGMENT_COUNT: number = 1 << SPLIT_COUNT;

/**
 * @description 分割中のセグメント（1セグメント = 始点・制御点・終点の x, y で 6 要素）。2 本を交互に使う（GC回避）
 *              Segments being split (six values each: x, y of start, control and end points).
 *              Two buffers used alternately to avoid GC overhead
 */
let $segments: Float64Array = new Float64Array(SEGMENT_COUNT * 6);
let $nextSegments: Float64Array = new Float64Array(SEGMENT_COUNT * 6);

/**
 * @description 右サイドの点（1セグメント = t=0, 0.5, 1 の x, y で 6 要素）。逆順に出力するため一旦ためる（GC回避）
 *              Points of the right side (six values each: x, y at t = 0, 0.5 and 1),
 *              kept until the end because they are emitted in reverse order
 */
const $rightPoints: Float64Array = new Float64Array(SEGMENT_COUNT * 6);

/**
 * @description $offsetPoint の結果
 *              Result of $offsetPoint
 */
let $offsetX: number = 0;
let $offsetY: number = 0;

/**
 * @description 2次ベジェ曲線上の t の点を、法線方向へ offset だけずらした点を $offsetX / $offsetY に求める
 *              （曲線上の座標・接線・正規化の計算を、オブジェクトを生成せずに行う）
 *              Computes into $offsetX / $offsetY the point at t on a quadratic Bezier curve, moved by
 *              offset along the normal (position, tangent and normalization without allocating objects)
 *
 * @param  {number} t - 曲線パラメータ（0〜1） / Curve parameter (0-1)
 * @param  {number} x0 - 始点のx / Start point x
 * @param  {number} y0 - 始点のy / Start point y
 * @param  {number} x1 - 制御点のx / Control point x
 * @param  {number} y1 - 制御点のy / Control point y
 * @param  {number} x2 - 終点のx / End point x
 * @param  {number} y2 - 終点のy / End point y
 * @param  {number} offset - オフセット距離 / Offset distance
 * @return {void}
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

    // 接線を 90 度回した法線を正規化
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
 * @description カーブの矩形を計算（WebGL版のMeshCalculateCurveRectangleUseCaseと同じ）
 *              Calculate curve rectangle (same as WebGL MeshCalculateCurveRectangleUseCase)
 *
 *              ストロークの輪郭は図形を初めて描くときに曲線ごとに計算されるため、点やセグメントごとに
 *              オブジェクトや配列を生成すると、その確保と回収が描画の停止として現れる。
 *              作業領域を使い回し、結果の配列だけを生成する。
 *              Outlines are computed per curve the first time a shape is drawn, so allocating an object or
 *              an array per point or segment shows up as a stall. Work buffers are reused and only the
 *              result array is allocated.
 *
 * @param  {IPoint} start_point - 始点 / Start point
 * @param  {IPoint} control_point - 制御点 / Control point
 * @param  {IPoint} end_point - 終点 / End point
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @return {IPath} カーブ矩形パス / Curve rectangle path
 */
export const calculateCurveRectangle = (
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint,
    thickness: number
): IPath => {

    // WebGL版と同じ分割数（5回分割 = 32セグメント）。De Casteljau で t = 0.5 の分割を繰り返す
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

    // 左サイドの最初のサブカーブ始点
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

        // 左サイド: WebGL版と同じく曲線フラグをtrueに設定（Loop-Blinn法で処理）
        $offsetPoint(0.5, x0, y0, x1, y1, x2, y2, +thickness);
        const controlX = $offsetX;
        const controlY = $offsetY;
        $offsetPoint(1, x0, y0, x1, y1, x2, y2, +thickness);
        paths.push(
            controlX, controlY, true,
            $offsetX, $offsetY, false
        );

        // 右サイドは逆順に出力するので、ここではためておく。
        // セグメント間の連続性を確保するため、各セグメントの始点には前のセグメントの終点を使う
        // （内側の曲線のつなぎめの隙間を解消）。最初のセグメントだけ自身の始点（t=0）を使う。
        if (idx === 0) {
            $offsetPoint(0, x0, y0, x1, y1, x2, y2, -thickness);
            rightPoints[source]     = $offsetX;
            rightPoints[source + 1] = $offsetY;
        }
        $offsetPoint(0.5, x0, y0, x1, y1, x2, y2, -thickness);
        rightPoints[source + 2] = $offsetX;
        rightPoints[source + 3] = $offsetY;
        $offsetPoint(1, x0, y0, x1, y1, x2, y2, -thickness);
        rightPoints[source + 4] = $offsetX;
        rightPoints[source + 5] = $offsetY;
    }

    // 右サイドの最初のサブカーブ始点（最後のセグメントの終点）
    const last = (count - 1) * 6;
    paths.push(rightPoints[last + 4], rightPoints[last + 5], false);

    // 右サイド: WebGL版と同じく曲線フラグをtrueに設定（Loop-Blinn法で処理）
    for (let idx = count - 1; idx >= 0; --idx) {
        const source = idx * 6;
        if (idx > 0) {
            // このセグメントの始点 = 前のセグメントの終点
            paths.push(
                rightPoints[source + 2], rightPoints[source + 3], true,
                rightPoints[source - 2], rightPoints[source - 1], false
            );
        } else {
            paths.push(
                rightPoints[source + 2], rightPoints[source + 3], true,
                rightPoints[source], rightPoints[source + 1], false
            );
        }
    }

    return paths;
};

/**
 * @description 直線の矩形を計算（WebGL版のMeshCalculateLineRectangleUseCaseと同じ）
 *              Calculate line rectangle (same as WebGL MeshCalculateLineRectangleUseCase)
 *
 * @param  {IPoint} start_point - 開始点 / Start point
 * @param  {IPoint} end_point - 終了点 / End point
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @return {IPath} 矩形パス / Rectangle path
 */
const $calculateLineRectangle = (
    start_point: IPoint,
    end_point: IPoint,
    thickness: number
): IPath =>
{
    const vector: IPoint = {
        "x": end_point.x - start_point.x,
        "y": end_point.y - start_point.y
    };

    const normal = $calculateNormalVector(vector.x, vector.y, thickness);

    const shiftedUpStart: IPoint = {
        "x": start_point.x + normal.x,
        "y": start_point.y + normal.y
    };

    const shiftedUpEnd: IPoint = {
        "x": end_point.x + normal.x,
        "y": end_point.y + normal.y
    };

    const shiftedDownEnd: IPoint = {
        "x": end_point.x - normal.x,
        "y": end_point.y - normal.y
    };

    const shiftedDownStart: IPoint = {
        "x": start_point.x - normal.x,
        "y": start_point.y - normal.y
    };

    return [
        shiftedUpStart.x, shiftedUpStart.y, false,
        shiftedUpEnd.x, shiftedUpEnd.y, false,
        shiftedDownEnd.x, shiftedDownEnd.y, false,
        shiftedDownStart.x, shiftedDownStart.y, false,
        shiftedUpStart.x, shiftedUpStart.y, false
    ];
};

/**
 * @description メッシュのパスの中で指定座標が含まれる線を探す
 *              Find paths overlapping with specified coordinates
 *              WebGL版のMeshFindOverlappingPathsServiceと同じ
 *
 * @param  {number} x - 中心x座標 / Center x coordinate
 * @param  {number} y - 中心y座標 / Center y coordinate
 * @param  {number} r - 半径 / Radius
 * @param  {IPath} paths - パスデータ / Path data
 * @return {number[]} 重複する座標配列 / Array of overlapping coordinates
 */
const $findOverlappingPaths = (
    x: number,
    y: number,
    r: number,
    paths: IPath
): number[] => {
    const points: number[] = [];
    // 浮動小数点誤差を考慮した許容範囲（非常に小さい値）
    const epsilon = 0.0001;
    for (let idx = 0; idx < paths.length; idx += 3) {
        // カーブのコントロール座標なら終了
        if (paths[idx + 2] as boolean) {
            continue;
        }

        const dx = paths[idx] as number;
        const dy = paths[idx + 1] as number;

        const distance = Math.sqrt(
            Math.pow(dx - x, 2) + Math.pow(dy - y, 2)
        );

        // 浮動小数点誤差を考慮した比較
        if (Math.abs(distance - r) > epsilon) {
            continue;
        }

        points.push(dx, dy);
    }
    return points;
};

/**
 * @description 矩形内に含まれてない座標を返却
 *              Return coordinates that are not inside the rectangle
 *              WebGL版のMeshIsPointInsideRectangleServiceと同じ
 *
 * @param  {number[]} points - 判定対象の座標配列 / Array of points to test
 * @param  {IPath} rectangle - 矩形パス / Rectangle path
 * @return {number[] | null} 矩形外の座標またはnull / Point outside rectangle or null
 */
const $findPointOutsideRectangle = (
    points: number[],
    rectangle: IPath
): number[] | null => {
    $canvasContext.beginPath();
    $canvasContext.moveTo(
        rectangle[0] as number,
        rectangle[1] as number
    );

    for (let idx = 3; idx < rectangle.length; idx += 3) {
        if (rectangle[idx + 2] as boolean) {
            $canvasContext.quadraticCurveTo(
                rectangle[idx] as number,
                rectangle[idx + 1] as number,
                rectangle[idx + 3] as number,
                rectangle[idx + 4] as number
            );
            idx += 3;
        } else {
            $canvasContext.lineTo(
                rectangle[idx] as number,
                rectangle[idx + 1] as number
            );
        }
    }

    $canvasContext.closePath();

    for (let idx = 0; idx < points.length; idx += 2) {
        const px = points[idx];
        const py = points[idx + 1];

        if ($canvasContext.isPointInPath(px, py)) {
            continue;
        }

        return [px, py];
    }

    return null;
};

/**
 * @description ベベル結合を生成（WebGL版のMeshGenerateCalculateBevelJoinUseCaseと同じ）
 *              Generate bevel join (same as WebGL MeshGenerateCalculateBevelJoinUseCase)
 *
 * @param  {number} x - 結合点のx座標 / Join point x coordinate
 * @param  {number} y - 結合点のy座標 / Join point y coordinate
 * @param  {number} r - 半径 / Radius
 * @param  {IPath[]} rectangles - 矩形パス配列 / Array of rectangle paths
 * @param  {boolean} is_last - 最後の結合かどうか / Whether this is the last join
 * @return {void}
 */
const $generateBevelJoin = (
    x: number,
    y: number,
    r: number,
    rectangles: IPath[],
    is_last: boolean = false
): void => {
    // WebGL版と同じ: isLastフラグでインデックスを切り替え
    const indexA = is_last ? 0 : rectangles.length - 1;
    const indexB = is_last ? rectangles.length - 1 : rectangles.length - 2;
    const pathsA = $findOverlappingPaths(x, y, r, rectangles[indexA]);
    const pathsB = $findOverlappingPaths(x, y, r, rectangles[indexB]);

    // パスが並行であれば終了
    if (pathsA[0] === pathsB[0] && pathsA[1] === pathsB[1]
        || pathsA[0] === pathsB[2] && pathsA[1] === pathsB[3]
    ) {
        return;
    }

    const pointA = $findPointOutsideRectangle(pathsA, rectangles[indexB]);
    if (!pointA) {
        return;
    }

    const pointB = $findPointOutsideRectangle(pathsB, rectangles[indexA]);
    if (!pointB) {
        return;
    }

    rectangles.splice(-1, 0, [
        x, y, false,
        pointA[0], pointA[1], false,
        pointB[0], pointB[1], false,
        x, y, false
    ]);
};

/**
 * @description ラウンド結合を生成（WebGL版のMeshGenerateCalculateRoundJoinUseCaseと同じ）
 *              Generate round join (same as WebGL MeshGenerateCalculateRoundJoinUseCase)
 *
 * @param  {number} x - 結合点のx座標 / Join point x coordinate
 * @param  {number} y - 結合点のy座標 / Join point y coordinate
 * @param  {number} r - 半径 / Radius
 * @param  {IPath[]} rectangles - 矩形パス配列 / Array of rectangle paths
 * @param  {boolean} is_last - 最後の結合かどうか / Whether this is the last join
 * @return {void}
 */
const $generateRoundJoin = (
    x: number,
    y: number,
    r: number,
    rectangles: IPath[],
    is_last: boolean = false
): void => {
    // WebGL版と同じ: isLastフラグでインデックスを切り替え
    const indexA = is_last ? 0 : rectangles.length - 1;
    const indexB = is_last ? rectangles.length - 1 : rectangles.length - 2;
    const pathsA = $findOverlappingPaths(x, y, r, rectangles[indexA]);
    const pathsB = $findOverlappingPaths(x, y, r, rectangles[indexB]);

    const pointA = $findPointOutsideRectangle(pathsA, rectangles[indexB]);
    if (!pointA) {
        return;
    }

    const pointB = $findPointOutsideRectangle(pathsB, rectangles[indexA]);
    if (!pointB) {
        return;
    }

    const angleA = Math.atan2(pointA[1] - y, pointA[0] - x);
    const angleB = Math.atan2(pointB[1] - y, pointB[0] - x);

    // 角度差を正規化して180度以下にする
    let angleDiff = angleB - angleA;
    if (angleDiff > Math.PI) {
        angleDiff -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
        angleDiff += 2 * Math.PI;
    }

    const segment = 8;
    const step = angleDiff / segment;

    const points: IPath = [x, y, false];
    for (let idx = 0; idx <= segment; idx++) {
        const angle = angleA + idx * step;
        const dx = x + r * Math.cos(angle);
        const dy = y + r * Math.sin(angle);
        points.push(dx, dy, false);
    }

    rectangles.splice(-1, 0, points);
};

/**
 * @description マイター結合を生成（WebGL版のMeshGenerateCalculateMiterJoinUseCaseと同じ）
 *              Generate miter join (same as WebGL MeshGenerateCalculateMiterJoinUseCase)
 *
 * @param  {IPoint} start_point - 結合点 / Join point
 * @param  {IPoint} end_point - 終了点 / End point
 * @param  {IPoint} prev_point - 前の点 / Previous point
 * @param  {number} r - 半径 / Radius
 * @param  {IPath[]} rectangles - 矩形パス配列 / Array of rectangle paths
 * @param  {boolean} is_last - 最後の結合かどうか / Whether this is the last join
 * @return {void}
 */
const $generateMiterJoin = (
    start_point: IPoint,
    end_point: IPoint,
    prev_point: IPoint,
    r: number,
    rectangles: IPath[],
    is_last: boolean = false
): void => {
    const indexA = is_last ? 0 : rectangles.length - 1;
    const indexB = is_last ? rectangles.length - 1 : rectangles.length - 2;
    const pathsA = $findOverlappingPaths(start_point.x, start_point.y, r, rectangles[indexA]);
    const pathsB = $findOverlappingPaths(start_point.x, start_point.y, r, rectangles[indexB]);

    // パスが並行であれば終了
    if (pathsA[0] === pathsB[0] && pathsA[1] === pathsB[1]
        || pathsA[0] === pathsB[2] && pathsA[1] === pathsB[3]
    ) {
        return;
    }

    const pointA = $findPointOutsideRectangle(pathsA, rectangles[indexB]);
    if (!pointA) {
        return;
    }

    const pointB = $findPointOutsideRectangle(pathsB, rectangles[indexA]);
    if (!pointB) {
        return;
    }

    const aVx = end_point.x - start_point.x;
    const aVy = end_point.y - start_point.y;
    const lengthA = Math.hypot(aVx, aVy);
    const normalizeA = {
        "x": aVx / lengthA,
        "y": aVy / lengthA
    };

    const bVx = prev_point.x - start_point.x;
    const bVy = prev_point.y - start_point.y;
    const lengthB = Math.hypot(bVx, bVy);
    const normalizeB = {
        "x": bVx / lengthB,
        "y": bVy / lengthB
    };

    const d1x = normalizeA.x, d1y = normalizeA.y;
    const d2x = normalizeB.x, d2y = normalizeB.y;

    const denom = d1x * d2y - d1y * d2x;
    if (denom === 0) {
        rectangles.splice(-1, 0, [
            start_point.x, start_point.y, false,
            pointA[0], pointA[1], false,
            pointB[0], pointB[1], false
        ]);
        return;
    }

    const t = ((pointB[0] - pointA[0]) * d2y - (pointB[1] - pointA[1]) * d2x) / denom;

    const ix = pointA[0] + t * d1x;
    const iy = pointA[1] + t * d1y;

    rectangles.splice(-1, 0, [
        start_point.x, start_point.y, false,
        pointA[0], pointA[1], false,
        ix, iy, false,
        start_point.x, start_point.y, false,
        pointB[0], pointB[1], false,
        ix, iy, false
    ]);
};

/**
 * @description ラウンドキャップを生成（WebGL版のMeshGenerateCalculateRoundCapServiceと同じ）
 *              Generate round cap (same as WebGL MeshGenerateCalculateRoundCapService)
 *
 * @param  {IPath} vertices - パス頂点 / Path vertices
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @param  {IPath[]} rectangles - 矩形パス配列 / Array of rectangle paths
 * @return {void}
 */
const $generateRoundCap = (
    vertices: IPath,
    thickness: number,
    rectangles: IPath[]
): void => {
    // 始点のキャップ
    // WebGL版と同じく隣接頂点を直接使用（制御点でもそのまま使用する）
    // カーブの場合、制御点への方向が正しい接線方向となる
    const startX = vertices[0] as number;
    const startY = vertices[1] as number;
    const startNextX = vertices[3] as number;
    const startNextY = vertices[4] as number;

    const startAngle = Math.atan2(startY - startNextY, startX - startNextX);
    const startCapPath: IPath = [startX, startY, false];
    const segment = 8;
    for (let i = 0; i <= segment; i++) {
        const angle = startAngle - Math.PI / 2 + i * Math.PI / segment;
        startCapPath.push(
            startX + thickness * Math.cos(angle),
            startY + thickness * Math.sin(angle),
            false
        );
    }
    rectangles.unshift(startCapPath);

    // 終点のキャップ
    // WebGL版と同じく隣接頂点を直接使用（制御点でもそのまま使用する）
    const endX = vertices[vertices.length - 3] as number;
    const endY = vertices[vertices.length - 2] as number;
    const endPrevX = vertices[vertices.length - 6] as number;
    const endPrevY = vertices[vertices.length - 5] as number;

    const endAngle = Math.atan2(endY - endPrevY, endX - endPrevX);
    const endCapPath: IPath = [endX, endY, false];
    for (let i = 0; i <= segment; i++) {
        const angle = endAngle - Math.PI / 2 + i * Math.PI / segment;
        endCapPath.push(
            endX + thickness * Math.cos(angle),
            endY + thickness * Math.sin(angle),
            false
        );
    }
    rectangles.push(endCapPath);
};

/**
 * @description スクエアキャップを生成（WebGL版のMeshGenerateCalculateSquareCapServiceと同じ）
 *              Generate square cap (same as WebGL MeshGenerateCalculateSquareCapService)
 *
 * @param  {IPath} vertices - パス頂点 / Path vertices
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @param  {IPath[]} rectangles - 矩形パス配列 / Array of rectangle paths
 * @return {void}
 */
const $generateSquareCap = (
    vertices: IPath,
    thickness: number,
    rectangles: IPath[]
): void => {
    // 始点のキャップ
    // WebGL版と同じく隣接頂点を直接使用（制御点でもそのまま使用する）
    const startX = vertices[0] as number;
    const startY = vertices[1] as number;
    const startNextX = vertices[3] as number;
    const startNextY = vertices[4] as number;

    const startDx = startX - startNextX;
    const startDy = startY - startNextY;
    const startLen = Math.hypot(startDx, startDy);
    if (startLen > 0) {
        const startNx = startDx / startLen;
        const startNy = startDy / startLen;
        const startExtX = startX + startNx * thickness;
        const startExtY = startY + startNy * thickness;

        const startCapPath: IPath = [
            startX - startNy * thickness, startY + startNx * thickness, false,
            startExtX - startNy * thickness, startExtY + startNx * thickness, false,
            startExtX + startNy * thickness, startExtY - startNx * thickness, false,
            startX + startNy * thickness, startY - startNx * thickness, false,
            startX - startNy * thickness, startY + startNx * thickness, false
        ];
        rectangles.unshift(startCapPath);
    }

    // 終点のキャップ
    // WebGL版と同じく隣接頂点を直接使用（制御点でもそのまま使用する）
    const endX = vertices[vertices.length - 3] as number;
    const endY = vertices[vertices.length - 2] as number;
    const endPrevX = vertices[vertices.length - 6] as number;
    const endPrevY = vertices[vertices.length - 5] as number;

    const endDx = endX - endPrevX;
    const endDy = endY - endPrevY;
    const endLen = Math.hypot(endDx, endDy);
    if (endLen > 0) {
        const endNx = endDx / endLen;
        const endNy = endDy / endLen;
        const endExtX = endX + endNx * thickness;
        const endExtY = endY + endNy * thickness;

        const endCapPath: IPath = [
            endX - endNy * thickness, endY + endNx * thickness, false,
            endExtX - endNy * thickness, endExtY + endNx * thickness, false,
            endExtX + endNy * thickness, endExtY - endNx * thickness, false,
            endX + endNy * thickness, endY - endNx * thickness, false,
            endX - endNy * thickness, endY + endNx * thickness, false
        ];
        rectangles.push(endCapPath);
    }
};

/**
 * @description 線の外周を算出して塗りのフォーマットで返却（WebGL版と同じ）
 *              Calculate the outer circumference of the line and return it in the format of the fill
 *
 * @param  {IPath} vertices - パス頂点 [x, y, isCurve, ...] / Path vertices
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @return {IPath[]} パス配列 / Array of paths
 */
export const generateStrokeOutline = (vertices: IPath, thickness: number): IPath[] =>
{
    // 再利用可能なオブジェクトを使用
    const startPoint = $startPoint;
    startPoint.x = vertices[0] as number;
    startPoint.y = vertices[1] as number;

    const controlPoint = $controlPoint;
    controlPoint.x = 0;
    controlPoint.y = 0;

    const endPoint = $endPoint;
    endPoint.x = 0;
    endPoint.y = 0;

    const prevPoint = $prevPoint;
    prevPoint.x = 0;
    prevPoint.y = 0;

    const rectangles: IPath[] = [];
    for (let idx = 3; idx < vertices.length; idx += 3) {

        const x = vertices[idx] as number;
        const y = vertices[idx + 1] as number;

        if (vertices[idx + 2] as boolean) {
            controlPoint.x = x;
            controlPoint.y = y;
            continue;
        }

        endPoint.x = x;
        endPoint.y = y;
        if (vertices[idx - 1] as boolean) {
            rectangles.push(
                calculateCurveRectangle(startPoint, controlPoint, endPoint, thickness)
            );
        } else {
            rectangles.push(
                $calculateLineRectangle(startPoint, endPoint, thickness)
            );
        }

        if (rectangles.length > 1) {
            switch ($context.joints) {

                case 0: // bevel
                    $generateBevelJoin(
                        startPoint.x, startPoint.y, thickness, rectangles
                    );
                    break;

                case 1: // miter
                    prevPoint.x = vertices[idx - 6] as number;
                    prevPoint.y = vertices[idx - 5] as number;
                    $generateMiterJoin(
                        startPoint, endPoint, prevPoint,
                        thickness, rectangles
                    );
                    break;

                case 2: // round
                    $generateRoundJoin(
                        startPoint.x, startPoint.y, thickness, rectangles
                    );
                    break;

            }
        }

        startPoint.x = endPoint.x;
        startPoint.y = endPoint.y;
    }

    // 始点と終点が繋がっているかどうかをチェック（浮動小数点誤差を考慮）
    const startX = vertices[0] as number;
    const startY = vertices[1] as number;
    const endX = vertices[vertices.length - 3] as number;
    const endY = vertices[vertices.length - 2] as number;
    const closedEpsilon = 0.0001; // 非常に小さい許容誤差
    const isClosed = Math.abs(startX - endX) < closedEpsilon
        && Math.abs(startY - endY) < closedEpsilon
        && rectangles.length > 1;

    if (isClosed) {

        // 始点と終点が繋がっている時はjointsの設定を適用（WebGL版と同じ）
        switch ($context.joints) {

            case 0: // bevel
                $generateBevelJoin(
                    startX, startY, thickness, rectangles, true
                );
                break;

            case 1: // miter
                startPoint.x = startX;
                startPoint.y = startY;
                endPoint.x = vertices[3] as number;
                endPoint.y = vertices[4] as number;
                prevPoint.x = vertices[vertices.length - 6] as number;
                prevPoint.y = vertices[vertices.length - 5] as number;
                $generateMiterJoin(
                    startPoint, endPoint, prevPoint,
                    thickness, rectangles, true
                );
                break;

            case 2: // round
                $generateRoundJoin(
                    startX, startY, thickness, rectangles, true
                );
                break;

            default:
                break;

        }
    } else if (rectangles.length > 0) {

        // 始点と終点が繋がってない時はcapsの設定を適用
        switch ($context.caps) {

            case 1: // round
                $generateRoundCap(
                    vertices, thickness, rectangles
                );
                break;

            case 2: // square
                $generateSquareCap(
                    vertices, thickness, rectangles
                );
                break;

            default:
                break;

        }
    }

    return rectangles;
};

/**
 * @description ストロークメッシュを生成（WebGL版のMeshStrokeGenerateUseCaseと同じ）
 *              Generate stroke mesh (same as WebGL MeshStrokeGenerateUseCase)
 *
 * @param  {IPath[]} vertices - パス頂点配列 / Array of path vertices
 * @param  {number} thickness - 線の太さ（フル値、内部で/2される） / Full line thickness (halved internally)
 * @return {IPath[]} 塗りフォーマットのパス配列 / Array of fill-format paths
 */
export const generateStrokeMesh = (vertices: IPath[], thickness: number): IPath[] =>
{
    // WebGL版と同じ: 内部で半分にする
    const halfThickness = thickness / 2;

    const fillVertices: IPath[] = [];
    for (const path of vertices) {
        if (path.length < 6) { continue }

        const outlines = generateStrokeOutline(path, halfThickness);
        for (const outline of outlines) {
            fillVertices.push(outline);
        }
    }

    return fillVertices;
};

