import type { IPoint } from "../../interface/IPoint";
import type { IPath } from "../../interface/IPath";
import { $context } from "../../WebGPUUtil";

/**
 * @description 法線ベクトルを計算（WebGL版のMeshCalculateNormalVectorServiceと同じ）
 * @param {number} x - 方向ベクトルのx成分
 * @param {number} y - 方向ベクトルのy成分
 * @param {number} thickness - 線の太さ（半分の値）
 * @return {IPoint}
 */
const calculateNormalVector = (x: number, y: number, thickness: number): IPoint =>
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
 * @description 矩形の情報を保持する型
 */
interface IRectangleInfo {
    path: IPath;
    startUp: IPoint;
    startDown: IPoint;
    endUp: IPoint;
    endDown: IPoint;
}

/**
 * @description 直線の矩形を計算（WebGL版のMeshCalculateLineRectangleUseCaseと同じ）
 * @param {IPoint} startPoint - 開始点
 * @param {IPoint} endPoint - 終了点
 * @param {number} thickness - 線の太さ（半分の値）
 * @return {IRectangleInfo} 矩形情報
 */
const calculateLineRectangle = (
    startPoint: IPoint,
    endPoint: IPoint,
    thickness: number
): IRectangleInfo =>
{
    const vector: IPoint = {
        "x": endPoint.x - startPoint.x,
        "y": endPoint.y - startPoint.y
    };

    const normal = calculateNormalVector(vector.x, vector.y, thickness);

    // 矩形の4頂点を生成（WebGL版と同じ順序）
    const shiftedUpStart: IPoint = {
        "x": startPoint.x + normal.x,
        "y": startPoint.y + normal.y
    };

    const shiftedUpEnd: IPoint = {
        "x": endPoint.x + normal.x,
        "y": endPoint.y + normal.y
    };

    const shiftedDownEnd: IPoint = {
        "x": endPoint.x - normal.x,
        "y": endPoint.y - normal.y
    };

    const shiftedDownStart: IPoint = {
        "x": startPoint.x - normal.x,
        "y": startPoint.y - normal.y
    };

    // WebGL版と同じフォーマット: [x, y, false, ...]
    const path: IPath = [
        shiftedUpStart.x, shiftedUpStart.y, false,
        shiftedUpEnd.x, shiftedUpEnd.y, false,
        shiftedDownEnd.x, shiftedDownEnd.y, false,
        shiftedDownStart.x, shiftedDownStart.y, false,
        shiftedUpStart.x, shiftedUpStart.y, false // 閉じる
    ];

    return {
        path,
        "startUp": shiftedUpStart,
        "startDown": shiftedDownStart,
        "endUp": shiftedUpEnd,
        "endDown": shiftedDownEnd
    };
};

/**
 * @description 線の外周を算出（WebGL版のMeshGenerateStrokeOutlineUseCaseと同じ）
 * @param {IPath} vertices - パス頂点 [x, y, isCurve, ...]
 * @param {number} thickness - 線の太さ（半分の値）
 * @return {IRectangleInfo[]} 矩形情報の配列
 */
export const generateStrokeOutline = (vertices: IPath, thickness: number): IRectangleInfo[] =>
{
    if (vertices.length < 6) {
        return [];
    }

    const startPoint: IPoint = {
        "x": vertices[0] as number,
        "y": vertices[1] as number
    };

    const endPoint: IPoint = { "x": 0, "y": 0 };

    const rectangles: IRectangleInfo[] = [];

    for (let idx = 3; idx < vertices.length; idx += 3) {
        const x = vertices[idx] as number;
        const y = vertices[idx + 1] as number;
        const isCurve = vertices[idx + 2] as boolean;

        if (isCurve) {
            // 制御点の場合はスキップ（次の終点で処理）
            continue;
        }

        endPoint.x = x;
        endPoint.y = y;

        // 直線の矩形を生成
        // 注: 曲線処理は簡略化（直線として処理）
        rectangles.push(
            calculateLineRectangle(startPoint, endPoint, thickness)
        );

        // 次の線分の開始点を更新
        startPoint.x = endPoint.x;
        startPoint.y = endPoint.y;
    }

    return rectangles;
};

/**
 * @description ベベル結合を生成（2つの矩形の間の三角形）
 * @param {IRectangleInfo} prevRect - 前の矩形
 * @param {IRectangleInfo} currRect - 現在の矩形
 * @param {number} centerX - 結合点のX座標
 * @param {number} centerY - 結合点のY座標
 * @return {number[]} 三角形の頂点データ
 */
const generateBevelJoin = (
    prevRect: IRectangleInfo,
    currRect: IRectangleInfo,
    centerX: number,
    centerY: number
): number[] => {
    const triangles: number[] = [];

    // 前の矩形の終点と現在の矩形の始点で三角形を作成
    // 上側の三角形
    triangles.push(
        centerX, centerY, 0, 0,
        prevRect.endUp.x, prevRect.endUp.y, 0, 0,
        currRect.startUp.x, currRect.startUp.y, 0, 0
    );

    // 下側の三角形
    triangles.push(
        centerX, centerY, 0, 0,
        currRect.startDown.x, currRect.startDown.y, 0, 0,
        prevRect.endDown.x, prevRect.endDown.y, 0, 0
    );

    return triangles;
};

/**
 * @description ラウンド結合を生成（WebGL版のMeshGenerateCalculateRoundJoinUseCaseと同じ）
 * @param {IRectangleInfo} prevRect - 前の矩形
 * @param {IRectangleInfo} currRect - 現在の矩形
 * @param {number} centerX - 結合点のX座標
 * @param {number} centerY - 結合点のY座標
 * @param {number} thickness - 線の太さ（半分の値）
 * @return {number[]} 三角形の頂点データ
 */
const generateRoundJoin = (
    prevRect: IRectangleInfo,
    currRect: IRectangleInfo,
    centerX: number,
    centerY: number,
    thickness: number
): number[] => {
    const triangles: number[] = [];

    // 前の矩形の終点と現在の矩形の始点の角度を計算
    const angleA = Math.atan2(prevRect.endUp.y - centerY, prevRect.endUp.x - centerX);
    const angleB = Math.atan2(currRect.startUp.y - centerY, currRect.startUp.x - centerX);

    // 角度差を正規化
    let angleDiff = angleB - angleA;
    if (angleDiff > Math.PI) {
        angleDiff -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
        angleDiff += 2 * Math.PI;
    }

    const segment = 8;
    const step = angleDiff / segment;

    // 扇形の三角形を生成
    for (let idx = 0; idx < segment; idx++) {
        const angle1 = angleA + idx * step;
        const angle2 = angleA + (idx + 1) * step;
        const dx1 = centerX + thickness * Math.cos(angle1);
        const dy1 = centerY + thickness * Math.sin(angle1);
        const dx2 = centerX + thickness * Math.cos(angle2);
        const dy2 = centerY + thickness * Math.sin(angle2);

        triangles.push(
            centerX, centerY, 0, 0,
            dx1, dy1, 0, 0,
            dx2, dy2, 0, 0
        );
    }

    // 下側も同様に処理
    const angleC = Math.atan2(prevRect.endDown.y - centerY, prevRect.endDown.x - centerX);
    const angleD = Math.atan2(currRect.startDown.y - centerY, currRect.startDown.x - centerX);

    let angleDiff2 = angleD - angleC;
    if (angleDiff2 > Math.PI) {
        angleDiff2 -= 2 * Math.PI;
    } else if (angleDiff2 < -Math.PI) {
        angleDiff2 += 2 * Math.PI;
    }

    const step2 = angleDiff2 / segment;

    for (let idx = 0; idx < segment; idx++) {
        const angle1 = angleC + idx * step2;
        const angle2 = angleC + (idx + 1) * step2;
        const dx1 = centerX + thickness * Math.cos(angle1);
        const dy1 = centerY + thickness * Math.sin(angle1);
        const dx2 = centerX + thickness * Math.cos(angle2);
        const dy2 = centerY + thickness * Math.sin(angle2);

        triangles.push(
            centerX, centerY, 0, 0,
            dx1, dy1, 0, 0,
            dx2, dy2, 0, 0
        );
    }

    return triangles;
};

/**
 * @description マイター結合を生成（WebGL版のMeshGenerateCalculateMiterJoinUseCaseと同じ）
 * @param {IRectangleInfo} prevRect - 前の矩形
 * @param {IRectangleInfo} currRect - 現在の矩形
 * @param {number} centerX - 結合点のX座標
 * @param {number} centerY - 結合点のY座標
 * @param {IPoint} prevStart - 前の線分の開始点
 * @param {IPoint} currEnd - 現在の線分の終了点
 * @return {number[]} 三角形の頂点データ
 */
const generateMiterJoin = (
    prevRect: IRectangleInfo,
    currRect: IRectangleInfo,
    centerX: number,
    centerY: number,
    prevStart: IPoint,
    currEnd: IPoint
): number[] => {
    const triangles: number[] = [];

    // 2つの線分の方向ベクトルを計算
    const aVx = currEnd.x - centerX;
    const aVy = currEnd.y - centerY;
    const lengthA = Math.hypot(aVx, aVy);
    const normalizeA = lengthA > 0
        ? { "x": aVx / lengthA, "y": aVy / lengthA }
        : { "x": 0, "y": 0 };

    const bVx = prevStart.x - centerX;
    const bVy = prevStart.y - centerY;
    const lengthB = Math.hypot(bVx, bVy);
    const normalizeB = lengthB > 0
        ? { "x": bVx / lengthB, "y": bVy / lengthB }
        : { "x": 0, "y": 0 };

    const d1x = normalizeA.x, d1y = normalizeA.y;
    const d2x = normalizeB.x, d2y = normalizeB.y;

    const denom = d1x * d2y - d1y * d2x;

    // 線が並行の場合はベベル結合にフォールバック
    if (Math.abs(denom) < 0.0001) {
        return generateBevelJoin(prevRect, currRect, centerX, centerY);
    }

    // 上側のマイター点を計算
    const pointA = [prevRect.endUp.x, prevRect.endUp.y];
    const pointB = [currRect.startUp.x, currRect.startUp.y];

    const t = ((pointB[0] - pointA[0]) * d2y - (pointB[1] - pointA[1]) * d2x) / denom;
    const ix = pointA[0] + t * d1x;
    const iy = pointA[1] + t * d1y;

    // 上側の三角形を2つ生成
    triangles.push(
        centerX, centerY, 0, 0,
        pointA[0], pointA[1], 0, 0,
        ix, iy, 0, 0
    );
    triangles.push(
        centerX, centerY, 0, 0,
        ix, iy, 0, 0,
        pointB[0], pointB[1], 0, 0
    );

    // 下側のマイター点を計算
    const pointC = [prevRect.endDown.x, prevRect.endDown.y];
    const pointD = [currRect.startDown.x, currRect.startDown.y];

    const t2 = ((pointD[0] - pointC[0]) * d2y - (pointD[1] - pointC[1]) * d2x) / denom;
    const ix2 = pointC[0] + t2 * d1x;
    const iy2 = pointC[1] + t2 * d1y;

    // 下側の三角形を2つ生成
    triangles.push(
        centerX, centerY, 0, 0,
        ix2, iy2, 0, 0,
        pointC[0], pointC[1], 0, 0
    );
    triangles.push(
        centerX, centerY, 0, 0,
        pointD[0], pointD[1], 0, 0,
        ix2, iy2, 0, 0
    );

    return triangles;
};

/**
 * @description ストロークメッシュを生成（WebGL版のMeshStrokeGenerateUseCaseと同じ）
 * @param {IPath[]} vertices - パス頂点配列
 * @param {number} thickness - 線の太さ（フル値、内部で/2される）
 * @return {Float32Array}
 */
export const generateStrokeMesh = (vertices: IPath[], thickness: number): Float32Array =>
{
    const triangles: number[] = [];

    // WebGL版と同じ: 内部で半分にする
    const halfThickness = thickness / 2;

    // WebGL版と同じ: $context.jointsを使用 (0: bevel, 1: miter, 2: round)
    const joints = $context.joints;

    for (const path of vertices) {
        if (path.length < 6) { continue }

        const rectangles = generateStrokeOutline(path, halfThickness);

        // 結合点の座標を追跡するために元のパスから取得
        const pathPoints: IPoint[] = [];
        for (let idx = 0; idx < path.length; idx += 3) {
            if (!(path[idx + 2] as boolean)) {  // カーブ制御点でない場合
                pathPoints.push({
                    "x": path[idx] as number,
                    "y": path[idx + 1] as number
                });
            }
        }

        let prevRect: IRectangleInfo | null = null;
        let pointIndex = 0;

        for (let i = 0; i < rectangles.length; i++) {
            const rectInfo = rectangles[i];
            const rect = rectInfo.path;
            if (rect.length < 15) { continue } // 最低5点（15要素）必要

            // 矩形の頂点を取得
            const p0x = rect[0] as number;  // shiftedUpStart
            const p0y = rect[1] as number;
            const p1x = rect[3] as number;  // shiftedUpEnd
            const p1y = rect[4] as number;
            const p2x = rect[6] as number;  // shiftedDownEnd
            const p2y = rect[7] as number;
            const p3x = rect[9] as number;  // shiftedDownStart
            const p3y = rect[10] as number;

            // 矩形を2つの三角形に分割
            // Triangle 1: p0, p1, p2
            triangles.push(
                p0x, p0y, 0, 0,
                p1x, p1y, 0, 0,
                p2x, p2y, 0, 0
            );

            // Triangle 2: p0, p2, p3
            triangles.push(
                p0x, p0y, 0, 0,
                p2x, p2y, 0, 0,
                p3x, p3y, 0, 0
            );

            // 結合処理（前の矩形がある場合）
            if (prevRect && pointIndex < pathPoints.length) {
                // 結合点は現在の矩形の始点（=前の矩形の終点）= パスの対応する点
                const centerX = pathPoints[pointIndex].x;
                const centerY = pathPoints[pointIndex].y;

                let joinTriangles: number[];
                switch (joints) {
                    case 0: // bevel
                        joinTriangles = generateBevelJoin(
                            prevRect,
                            rectInfo,
                            centerX,
                            centerY
                        );
                        break;

                    case 1: // miter
                        {
                            // 前の点と次の点を取得してマイター結合
                            const prevStart = pointIndex > 0
                                ? pathPoints[pointIndex - 1]
                                : pathPoints[0];
                            const currEnd = pointIndex + 1 < pathPoints.length
                                ? pathPoints[pointIndex + 1]
                                : pathPoints[pathPoints.length - 1];
                            joinTriangles = generateMiterJoin(
                                prevRect,
                                rectInfo,
                                centerX,
                                centerY,
                                prevStart,
                                currEnd
                            );
                        }
                        break;

                    case 2: // round
                        joinTriangles = generateRoundJoin(
                            prevRect,
                            rectInfo,
                            centerX,
                            centerY,
                            halfThickness
                        );
                        break;

                    default:
                        joinTriangles = generateBevelJoin(
                            prevRect,
                            rectInfo,
                            centerX,
                            centerY
                        );
                        break;
                }
                triangles.push(...joinTriangles);
            }

            prevRect = rectInfo;
            pointIndex++;
        }

        // パスが閉じている場合は最後と最初の矩形も結合
        if (path[0] === path[path.length - 3]
            && path[1] === path[path.length - 2]
            && rectangles.length > 1
        ) {
            const firstRect = rectangles[0];
            const lastRect = rectangles[rectangles.length - 1];
            const centerX = path[0] as number;
            const centerY = path[1] as number;

            let joinTriangles: number[];
            switch (joints) {
                case 0: // bevel
                    joinTriangles = generateBevelJoin(
                        lastRect,
                        firstRect,
                        centerX,
                        centerY
                    );
                    break;

                case 1: // miter
                    {
                        const prevStart = pathPoints[pathPoints.length - 2] || pathPoints[0];
                        const currEnd = pathPoints[1] || pathPoints[0];
                        joinTriangles = generateMiterJoin(
                            lastRect,
                            firstRect,
                            centerX,
                            centerY,
                            prevStart,
                            currEnd
                        );
                    }
                    break;

                case 2: // round
                    joinTriangles = generateRoundJoin(
                        lastRect,
                        firstRect,
                        centerX,
                        centerY,
                        halfThickness
                    );
                    break;

                default:
                    joinTriangles = generateBevelJoin(
                        lastRect,
                        firstRect,
                        centerX,
                        centerY
                    );
                    break;
            }
            triangles.push(...joinTriangles);
        }
    }

    return new Float32Array(triangles);
};

/**
 * @description IPoint[][]形式からストロークメッシュを生成（後方互換用）
 * @param {IPoint[][]} paths - パス配列
 * @param {number} thickness - 線の太さ
 * @return {Float32Array}
 */
export const generateStrokeMeshFromPoints = (paths: IPoint[][], thickness: number): Float32Array =>
{
    const triangles: number[] = [];

    // WebGL版と同じ: 内部で半分にする
    const halfThickness = thickness / 2;

    for (const path of paths) {
        if (path.length < 2) { continue }

        // 各線分に対して矩形を生成
        for (let i = 0; i < path.length - 1; i++) {
            const startPoint = path[i];
            const endPoint = path[i + 1];

            const vector: IPoint = {
                "x": endPoint.x - startPoint.x,
                "y": endPoint.y - startPoint.y
            };

            const normal = calculateNormalVector(vector.x, vector.y, halfThickness);

            // 矩形の4頂点
            const p0x = startPoint.x + normal.x;
            const p0y = startPoint.y + normal.y;
            const p1x = endPoint.x + normal.x;
            const p1y = endPoint.y + normal.y;
            const p2x = endPoint.x - normal.x;
            const p2y = endPoint.y - normal.y;
            const p3x = startPoint.x - normal.x;
            const p3y = startPoint.y - normal.y;

            // Triangle 1: p0, p1, p2
            triangles.push(
                p0x, p0y, 0, 0,
                p1x, p1y, 0, 0,
                p2x, p2y, 0, 0
            );

            // Triangle 2: p0, p2, p3
            triangles.push(
                p0x, p0y, 0, 0,
                p2x, p2y, 0, 0,
                p3x, p3y, 0, 0
            );
        }
    }

    return new Float32Array(triangles);
};
