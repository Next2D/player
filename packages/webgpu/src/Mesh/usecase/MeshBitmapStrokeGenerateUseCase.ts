import type { IPath } from "../../interface/IPath";
import type { IMeshResult } from "../../interface/IMeshResult";
import { generateStrokeOutline } from "./MeshStrokeGenerateUseCase";
import { execute as meshStrokeFillGenerateService } from "../service/MeshStrokeFillGenerateService";

/**
 * @description ビットマップストローク用のメッシュを生成する（WebGL版と同じ仕様）
 *              Generate a mesh for bitmap stroke (same specification as WebGL)
 *
 * 頂点フォーマット（17 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - Loop-Blinn用の暗黙的関数座標
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
    viewport_width: number,
    viewport_height: number
): IMeshResult => {

    // WebGL版と同じ: 内部で半分にする
    const halfThickness = thickness / 2;

    // WebGL版と同じ: 行列をビューポートサイズで正規化
    const normalizedA  = a / viewport_width;
    const normalizedC  = c / viewport_width;
    const normalizedTx = tx / viewport_width;
    const normalizedB  = b / viewport_height;
    const normalizedD  = d / viewport_height;
    const normalizedTy = ty / viewport_height;

    // 各パスのアウトラインを生成
    const fillVertices: IPath[] = [];
    for (const path of vertices) {
        const outlines = generateStrokeOutline(path, halfThickness);
        for (const outline of outlines) {
            fillVertices.push(outline);
        }
    }

    // 頂点数を計算（各パスの三角形数 × 3）
    let totalVertices = 0;
    for (const vertex of fillVertices) {
        const length = vertex.length - 5;
        for (let idx = 3; idx < length; idx += 3) {
            totalVertices += 3;
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
    for (const vertex of fillVertices) {
        index = meshStrokeFillGenerateService(
            vertex,
            buffer,
            index,
            normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy,
            red, green, blue, alpha
        );
    }

    return {
        buffer,
        "indexCount": index
    };
};
