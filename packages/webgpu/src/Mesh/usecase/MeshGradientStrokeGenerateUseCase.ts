import type { IPath } from "../../interface/IPath";
import type { IMeshResult } from "../../interface/IMeshResult";
import { generateStrokeOutline } from "./MeshStrokeGenerateUseCase";

/**
 * @description グラデーションストローク用のメッシュを生成する（WebGL版と同じ仕様）
 *              Generate a mesh for gradient stroke (same specification as WebGL)
 *
 * 頂点フォーマット（17 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - 0.5, 0.5 (ストロークは曲線判定をスキップ)
 * - color: r, g, b, a (4 floats)
 * - matrix row 0: a, b, 0 (3 floats)
 * - matrix row 1: c, d, 0 (3 floats)
 * - matrix row 2: tx, ty, 0 (3 floats)
 *
 * @param  {IPath[]} vertices - パス頂点配列 [x, y, isCurve, ...]
 * @param  {number} thickness - 線の太さ（フル値、内部で/2される）
 * @param  {number} a - 行列要素
 * @param  {number} b - 行列要素
 * @param  {number} c - 行列要素
 * @param  {number} d - 行列要素
 * @param  {number} tx - 行列要素
 * @param  {number} ty - 行列要素
 * @param  {number} red
 * @param  {number} green
 * @param  {number} blue
 * @param  {number} alpha
 * @param  {number} viewportWidth - ビューポート幅
 * @param  {number} viewportHeight - ビューポート高さ
 * @return {IMeshResult}
 * @method
 * @protected
 */
export const execute = (
    vertices: IPath[],
    thickness: number,
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
    red: number,
    green: number,
    blue: number,
    alpha: number,
    viewportWidth: number,
    viewportHeight: number
): IMeshResult => {

    // WebGL版と同じ: 内部で半分にする
    const halfThickness = thickness / 2;

    // WebGL版と同じ: 行列をビューポートサイズで正規化
    const normalizedA  = a / viewportWidth;
    const normalizedC  = c / viewportWidth;
    const normalizedTx = tx / viewportWidth;
    const normalizedB  = b / viewportHeight;
    const normalizedD  = d / viewportHeight;
    const normalizedTy = ty / viewportHeight;

    // 各パスの矩形を生成して頂点数をカウント
    const allRectangles: IPath[] = [];
    let totalVertices = 0;

    for (const path of vertices) {
        const rectangles = generateStrokeOutline(path, halfThickness);
        for (const rectInfo of rectangles) {
            const rect = rectInfo.path;
            if (rect.length >= 15) {
                allRectangles.push(rect);
                // 各矩形は2つの三角形 = 6頂点
                totalVertices += 6;
            }
        }
    }

    if (totalVertices === 0) {
        return {
            "buffer": new Float32Array(0),
            "indexCount": 0
        };
    }

    // バッファを確保（17 floats per vertex）
    const buffer = new Float32Array(totalVertices * 17);

    let index = 0;
    for (const rect of allRectangles) {
        // 矩形の頂点を取得
        const p0x = rect[0] as number;
        const p0y = rect[1] as number;
        const p1x = rect[3] as number;
        const p1y = rect[4] as number;
        const p2x = rect[6] as number;
        const p2y = rect[7] as number;
        const p3x = rect[9] as number;
        const p3y = rect[10] as number;

        // Triangle 1: p0, p1, p2
        index = writeVertex(buffer, index, p0x, p0y, normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy, red, green, blue, alpha);
        index = writeVertex(buffer, index, p1x, p1y, normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy, red, green, blue, alpha);
        index = writeVertex(buffer, index, p2x, p2y, normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy, red, green, blue, alpha);

        // Triangle 2: p0, p2, p3
        index = writeVertex(buffer, index, p0x, p0y, normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy, red, green, blue, alpha);
        index = writeVertex(buffer, index, p2x, p2y, normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy, red, green, blue, alpha);
        index = writeVertex(buffer, index, p3x, p3y, normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy, red, green, blue, alpha);
    }

    return {
        buffer,
        "indexCount": index
    };
};

/**
 * @description 頂点データを書き込む
 */
const writeVertex = (
    buffer: Float32Array,
    index: number,
    x: number,
    y: number,
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
    red: number,
    green: number,
    blue: number,
    alpha: number
): number => {
    let position = index * 17;

    // position (2 floats)
    buffer[position++] = x;
    buffer[position++] = y;

    // bezier (2 floats) - ストロークは曲線判定をスキップ
    buffer[position++] = 0.5;
    buffer[position++] = 0.5;

    // color (4 floats)
    buffer[position++] = red;
    buffer[position++] = green;
    buffer[position++] = blue;
    buffer[position++] = alpha;

    // matrix row 0 (3 floats)
    buffer[position++] = a;
    buffer[position++] = b;
    buffer[position++] = 0;

    // matrix row 1 (3 floats)
    buffer[position++] = c;
    buffer[position++] = d;
    buffer[position++] = 0;

    // matrix row 2 (3 floats)
    buffer[position++] = tx;
    buffer[position++] = ty;
    buffer[position++] = 0;

    return index + 1;
};
