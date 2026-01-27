import type { IPoint } from "../../interface/IPoint";
import type { IPath } from "../../interface/IPath";

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
        return { x: 0, y: 0 };
    }
    return {
        x: -(y / magnitude) * thickness,
        y: (x / magnitude) * thickness
    };
};

/**
 * @description 直線の矩形を計算（WebGL版のMeshCalculateLineRectangleUseCaseと同じ）
 * @param {IPoint} startPoint - 開始点
 * @param {IPoint} endPoint - 終了点
 * @param {number} thickness - 線の太さ（半分の値）
 * @return {IPath} 矩形パス [x, y, false, ...]
 */
const calculateLineRectangle = (
    startPoint: IPoint,
    endPoint: IPoint,
    thickness: number
): IPath =>
{
    const vector: IPoint = {
        x: endPoint.x - startPoint.x,
        y: endPoint.y - startPoint.y
    };

    const normal = calculateNormalVector(vector.x, vector.y, thickness);

    // 矩形の4頂点を生成（WebGL版と同じ順序）
    const shiftedUpStart: IPoint = {
        x: startPoint.x + normal.x,
        y: startPoint.y + normal.y
    };

    const shiftedUpEnd: IPoint = {
        x: endPoint.x + normal.x,
        y: endPoint.y + normal.y
    };

    const shiftedDownEnd: IPoint = {
        x: endPoint.x - normal.x,
        y: endPoint.y - normal.y
    };

    const shiftedDownStart: IPoint = {
        x: startPoint.x - normal.x,
        y: startPoint.y - normal.y
    };

    // WebGL版と同じフォーマット: [x, y, false, ...]
    return [
        shiftedUpStart.x, shiftedUpStart.y, false,
        shiftedUpEnd.x, shiftedUpEnd.y, false,
        shiftedDownEnd.x, shiftedDownEnd.y, false,
        shiftedDownStart.x, shiftedDownStart.y, false,
        shiftedUpStart.x, shiftedUpStart.y, false // 閉じる
    ];
};

/**
 * @description 線の外周を算出（WebGL版のMeshGenerateStrokeOutlineUseCaseと同じ）
 * @param {IPath} vertices - パス頂点 [x, y, isCurve, ...]
 * @param {number} thickness - 線の太さ（半分の値）
 * @return {IPath[]} 矩形パスの配列
 */
export const generateStrokeOutline = (vertices: IPath, thickness: number): IPath[] =>
{
    if (vertices.length < 6) {
        return [];
    }

    const startPoint: IPoint = {
        x: vertices[0] as number,
        y: vertices[1] as number
    };

    const endPoint: IPoint = { x: 0, y: 0 };

    const rectangles: IPath[] = [];

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

    for (const path of vertices) {
        const rectangles = generateStrokeOutline(path, halfThickness);

        for (const rect of rectangles) {
            if (rect.length < 15) continue; // 最低5点（15要素）必要

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
        if (path.length < 2) continue;

        // 各線分に対して矩形を生成
        for (let i = 0; i < path.length - 1; i++) {
            const startPoint = path[i];
            const endPoint = path[i + 1];

            const vector: IPoint = {
                x: endPoint.x - startPoint.x,
                y: endPoint.y - startPoint.y
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
