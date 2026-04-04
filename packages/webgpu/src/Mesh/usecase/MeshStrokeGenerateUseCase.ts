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
 * @description 線形補間（lerp）
 *              Linear interpolation between two points
 *
 * @param  {IPoint} p0 - 始点 / Start point
 * @param  {IPoint} p1 - 終点 / End point
 * @param  {number} t - 補間パラメータ（0〜1） / Interpolation parameter (0-1)
 * @return {IPoint} 補間された点 / Interpolated point
 */
const $lerp = (p0: IPoint, p1: IPoint, t: number): IPoint => ({
    "x": p0.x + (p1.x - p0.x) * t,
    "y": p0.y + (p1.y - p0.y) * t
});

/**
 * @description ベクトルの正規化
 *              Normalize a vector to unit length
 *
 * @param  {IPoint} point - 正規化する点 / Point to normalize
 * @return {IPoint} 正規化された点 / Normalized point
 */
const $normalize = (point: IPoint): IPoint => {
    const length = Math.sqrt(point.x * point.x + point.y * point.y);
    return length === 0
        ? { "x": 0, "y": 0 }
        : { "x": point.x / length, "y": point.y / length };
};

/**
 * @description 二次ベジェ曲線上の座標を計算
 *              Calculate a point on a quadratic Bezier curve
 *
 * @param  {number} t - 曲線パラメータ（0〜1） / Curve parameter (0-1)
 * @param  {IPoint} s0 - 始点 / Start point
 * @param  {IPoint} s1 - 制御点 / Control point
 * @param  {IPoint} s2 - 終点 / End point
 * @return {IPoint} 曲線上の座標 / Point on the curve
 */
const $getQuadraticBezierPoint = (
    t: number,
    s0: IPoint,
    s1: IPoint,
    s2: IPoint
): IPoint => ({
    "x": (1 - t) ** 2 * s0.x + 2 * (1 - t) * t * s1.x + t ** 2 * s2.x,
    "y": (1 - t) ** 2 * s0.y + 2 * (1 - t) * t * s1.y + t ** 2 * s2.y
});

/**
 * @description 二次ベジェ曲線上の接線ベクトルを計算
 *              Calculate the tangent vector on a quadratic Bezier curve
 *
 * @param  {number} t - 曲線パラメータ（0〜1） / Curve parameter (0-1)
 * @param  {IPoint} s0 - 始点 / Start point
 * @param  {IPoint} s1 - 制御点 / Control point
 * @param  {IPoint} s2 - 終点 / End point
 * @return {IPoint} 接線ベクトル / Tangent vector
 */
const $getQuadraticBezierTangent = (
    t: number,
    s0: IPoint,
    s1: IPoint,
    s2: IPoint
): IPoint => ({
    "x": 2 * (1 - t) * (s1.x - s0.x) + 2 * t * (s2.x - s1.x),
    "y": 2 * (1 - t) * (s1.y - s0.y) + 2 * t * (s2.y - s1.y)
});

/**
 * @description 二次ベジェ曲線を分割
 *              Split a quadratic Bezier curve at a given parameter
 *
 * @param  {IPoint} s0 - 始点 / Start point
 * @param  {IPoint} s1 - 制御点 / Control point
 * @param  {IPoint} s2 - 終点 / End point
 * @param  {number} t - 分割パラメータ / Split parameter
 * @return {Array<IPoint[]>} 分割された2つの曲線 / Two split curves
 */
const $splitQuadraticBezier = (
    s0: IPoint,
    s1: IPoint,
    s2: IPoint,
    t: number = 0.5
): Array<IPoint[]> => {
    const M0 = $lerp(s0, s1, t);
    const M1 = $lerp(s1, s2, t);
    const M01 = $lerp(M0, M1, t);
    return [
        [s0, M0, M01],
        [M01, M1, s2]
    ];
};

/**
 * @description ベジェ曲線を複数回分割
 *              Split a Bezier curve multiple times
 *
 * @param  {IPoint} s0 - 始点 / Start point
 * @param  {IPoint} s1 - 制御点 / Control point
 * @param  {IPoint} s2 - 終点 / End point
 * @param  {number} n - 分割回数 / Number of splits
 * @return {Array<IPoint[]>} 分割されたセグメント配列 / Array of split segments
 */
const $splitBezierMultipleTimes = (
    s0: IPoint,
    s1: IPoint,
    s2: IPoint,
    n: number = 4
): Array<IPoint[]> => {
    let segments: Array<IPoint[]> = [[s0, s1, s2]];
    for (let i = 0; i < n; i++) {
        const newSegments: Array<IPoint[]> = [];
        for (const seg of segments) {
            const splitted = $splitQuadraticBezier(seg[0], seg[1], seg[2], 0.5);
            newSegments.push(splitted[0], splitted[1]);
        }
        segments = newSegments;
    }
    return segments;
};

/**
 * @description 2次ベジェのオフセットを計算
 *              Calculate offset of a quadratic Bezier curve
 *
 * @param  {IPoint} s0 - 始点 / Start point
 * @param  {IPoint} s1 - 制御点 / Control point
 * @param  {IPoint} s2 - 終点 / End point
 * @param  {number} offset - オフセット距離 / Offset distance
 * @return {IPoint[]} オフセットされた点配列 / Array of offset points
 */
const $approximateOffsetQuadratic = (
    s0: IPoint,
    s1: IPoint,
    s2: IPoint,
    offset: number
): IPoint[] => {
    const tValues = [0, 0.5, 1];
    const newPoints: IPoint[] = [];

    for (const t of tValues) {
        const pos = $getQuadraticBezierPoint(t, s0, s1, s2);
        const tan = $getQuadraticBezierTangent(t, s0, s1, s2);
        const n = $normalize({ "x": -tan.y, "y": tan.x });
        newPoints.push({
            "x": pos.x + n.x * offset,
            "y": pos.y + n.y * offset
        });
    }
    return newPoints;
};

/**
 * @description カーブの矩形を計算（WebGL版のMeshCalculateCurveRectangleUseCaseと同じ）
 *              Calculate curve rectangle (same as WebGL MeshCalculateCurveRectangleUseCase)
 *
 * @param  {IPoint} start_point - 始点 / Start point
 * @param  {IPoint} control_point - 制御点 / Control point
 * @param  {IPoint} end_point - 終点 / End point
 * @param  {number} thickness - 線の太さ（半分の値） / Half line thickness
 * @return {IPath} カーブ矩形パス / Curve rectangle path
 */
const $calculateCurveRectangle = (
    start_point: IPoint,
    control_point: IPoint,
    end_point: IPoint,
    thickness: number
): IPath => {
    // WebGL版と同じ分割数（5回分割 = 32セグメント）
    const segments = $splitBezierMultipleTimes(start_point, control_point, end_point, 5);

    const leftCurves: Array<IPoint[]> = [];
    const rightCurves: Array<IPoint[]> = [];

    for (const seg of segments) {
        leftCurves.push($approximateOffsetQuadratic(seg[0], seg[1], seg[2], +thickness));
        rightCurves.push($approximateOffsetQuadratic(seg[0], seg[1], seg[2], -thickness));
    }

    // セグメント間の連続性を確保：各セグメントの終点を次のセグメントの始点に強制一致
    // これにより内側の曲線のつなぎめの隙間を解消
    for (let idx = 0; idx < leftCurves.length - 1; ++idx) {
        leftCurves[idx + 1][0] = leftCurves[idx][2];
    }
    for (let idx = 0; idx < rightCurves.length - 1; ++idx) {
        rightCurves[idx + 1][0] = rightCurves[idx][2];
    }

    // 左サイドの最初のサブカーブ始点
    const leftStart = leftCurves[0][0];
    const paths: IPath = [leftStart.x, leftStart.y, false];

    // 左サイド: WebGL版と同じく曲線フラグをtrueに設定（Loop-Blinn法で処理）
    for (let idx = 0; idx < leftCurves.length; ++idx) {
        const curves = leftCurves[idx];
        paths.push(
            curves[1].x, curves[1].y, true,
            curves[2].x, curves[2].y, false
        );
    }

    const reversedRight = [...rightCurves].reverse();
    for (let idx = 0; idx < reversedRight.length; ++idx) {
        const [q0, q1, q2] = reversedRight[idx];
        reversedRight[idx] = [q2, q1, q0]; // [Q2, Q1, Q0]
    }

    // 右サイドの最初のサブカーブ始点
    const rightEnd = reversedRight[0][0];
    paths.push(rightEnd.x, rightEnd.y, false);

    // 右サイド: WebGL版と同じく曲線フラグをtrueに設定（Loop-Blinn法で処理）
    for (let idx = 0; idx < reversedRight.length; ++idx) {
        const curves = reversedRight[idx];
        paths.push(
            curves[1].x, curves[1].y, true,
            curves[2].x, curves[2].y, false
        );
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
                $calculateCurveRectangle(startPoint, controlPoint, endPoint, thickness)
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

