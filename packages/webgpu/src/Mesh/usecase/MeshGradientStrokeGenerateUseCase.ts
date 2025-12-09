import type { IPoint } from "../../interface/IPoint";
import type { IMeshResult } from "../../interface/IMeshResult";
import { generateStrokeOutline } from "./MeshStrokeGenerateUseCase";

/**
 * @description グラデーションストローク用のメッシュを生成する
 *              Generate a mesh for gradient stroke
 *
 * 頂点フォーマット（17 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - 0.5, 0.5 (ストロークは曲線判定をスキップ)
 * - color: r, g, b, a (4 floats)
 * - matrix row 0: a, b, 0 (3 floats)
 * - matrix row 1: c, d, 0 (3 floats)
 * - matrix row 2: tx, ty, 0 (3 floats)
 *
 * @param  {IPoint[][]} paths
 * @param  {number} thickness
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
    paths: IPoint[][],
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

    // WebGL版と同じ: 行列をビューポートサイズで正規化
    const normalizedA  = a / viewportWidth;
    const normalizedC  = c / viewportWidth;
    const normalizedTx = tx / viewportWidth;
    const normalizedB  = b / viewportHeight;
    const normalizedD  = d / viewportHeight;
    const normalizedTy = ty / viewportHeight;

    // 各パスのアウトラインを生成して頂点数をカウント
    const allOutlines: IPoint[][] = [];
    let totalVertices = 0;

    for (const path of paths) {
        const outlines = generateStrokeOutline(path, thickness);
        for (const outline of outlines) {
            if (outline.length >= 3) {
                allOutlines.push(outline);
                // 扇形三角形分割: (n - 2) 三角形 × 3 頂点
                totalVertices += (outline.length - 2) * 3;
            }
        }
    }

    if (totalVertices === 0) {
        return {
            buffer: new Float32Array(0),
            indexCount: 0
        };
    }

    // バッファを確保（17 floats per vertex）
    const buffer = new Float32Array(totalVertices * 17);

    let index = 0;
    for (const outline of allOutlines) {
        // 単純な三角形分割（扇形）
        for (let i = 1; i < outline.length - 1; i++) {
            // 三角形の3頂点を追加
            index = writeVertex(
                buffer, index,
                outline[0].x, outline[0].y,
                normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy,
                red, green, blue, alpha
            );
            index = writeVertex(
                buffer, index,
                outline[i].x, outline[i].y,
                normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy,
                red, green, blue, alpha
            );
            index = writeVertex(
                buffer, index,
                outline[i + 1].x, outline[i + 1].y,
                normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy,
                red, green, blue, alpha
            );
        }
    }

    return {
        buffer,
        indexCount: index
    };
};

/**
 * @description 頂点データを書き込む
 * @param {Float32Array} buffer
 * @param {number} index
 * @param {number} x
 * @param {number} y
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} tx
 * @param {number} ty
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 * @return {number}
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
