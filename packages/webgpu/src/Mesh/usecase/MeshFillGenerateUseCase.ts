import type { IPath } from "../../interface/IPath";
import { execute as meshFillGenerateService } from "../service/MeshFillGenerateService";

/**
 * @description 塗りメッシュの結果インターフェース
 *              Fill mesh result interface
 */
export interface IFillMesh {
    buffer: Float32Array;
    indexCount: number;
}

/**
 * @description 塗りのメッシュを生成する
 *              Generate a fill mesh
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
 * @return {IFillMesh}
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
    alpha: number
): IFillMesh => {

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
            a, b, c, d, tx, ty,
            red, green, blue, alpha
        );
    }

    return {
        buffer,
        indexCount: index
    };
};
