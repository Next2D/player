import type { IPath } from "../../interface/IPath";
import type { IMeshResult } from "../../interface/IMeshResult";
import { execute as meshFillGenerateService } from "../service/MeshFillGenerateService";

/**
 * @description 塗りのメッシュを生成する（WebGL版と同じ行列正規化を行う）
 *              Generate a fill mesh (with viewport matrix normalization like WebGL)
 *
 * @param  {IPath[]} vertices
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

    // 頂点数を計算（各パスの三角形数 × 3）
    let totalVertices = 0;
    for (const vertex of vertices) {
        const length = vertex.length - 5;
        for (let idx = 3; idx < length; idx += 3) {
            totalVertices += 3;
        }
    }

    // バッファを確保（17 floats per vertex）
    const buffer = new Float32Array(totalVertices * 17);

    let index = 0;
    for (const vertex of vertices) {
        index = meshFillGenerateService(
            vertex,
            buffer,
            index,
            normalizedA, normalizedB, normalizedC, normalizedD, normalizedTx, normalizedTy,
            red, green, blue, alpha
        );
    }

    return {
        buffer,
        indexCount: index
    };
};
