import type { IPath } from "../../interface/IPath";

/**
 * @description 塗りのメッシュを生成する（Loop-Blinn方式対応）
 *              Generate a fill mesh with Loop-Blinn method support
 *
 * 頂点フォーマット（17 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - Loop-Blinn用の暗黙的関数座標
 * - color: r, g, b, a (4 floats)
 * - matrix row 0: a, b, 0 (3 floats)
 * - matrix row 1: c, d, 0 (3 floats)
 * - matrix row 2: tx, ty, 0 (3 floats)
 *
 * @param  {IPath} vertex
 * @param  {Float32Array} buffer
 * @param  {number} index - 現在の頂点インデックス
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
 * @return {number} 新しい頂点インデックス
 * @method
 * @protected
 */
export const execute = (
    vertex: IPath,
    buffer: Float32Array,
    index: number,
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

    const length = vertex.length - 5;

    for (let idx = 3; idx < length; idx += 3) {

        let position = index * 17;

        if (vertex[idx + 2]) {
            // ベジェ曲線セグメント
            // 座標A（始点）: bezier = (0, 0)
            buffer[position++] = vertex[idx - 3] as number;
            buffer[position++] = vertex[idx - 2] as number;
            buffer[position++] = 0;
            buffer[position++] = 0;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

            // 座標B（制御点）: bezier = (0.5, 0)
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

            // 座標C（終点）: bezier = (1, 1)
            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 1;
            buffer[position++] = 1;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

        } else if (vertex[idx + 5]) {
            // 次がベジェ曲線の場合（内部三角形）
            // bezier = (0.5, 0.5) → 曲線判定をスキップ

            // 座標A（パス始点）
            buffer[position++] = vertex[0] as number;
            buffer[position++] = vertex[1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

            // 座標B
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

            // 座標C（次のベジェ曲線の終点）
            buffer[position++] = vertex[idx + 6] as number;
            buffer[position++] = vertex[idx + 7] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

        } else {
            // 直線セグメント（内部三角形）
            // bezier = (0.5, 0.5) → 曲線判定をスキップ

            // 座標A（パス始点）
            buffer[position++] = vertex[0] as number;
            buffer[position++] = vertex[1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

            // 座標B
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;

            // 座標C
            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = a;
            buffer[position++] = b;
            buffer[position++] = 0;
            buffer[position++] = c;
            buffer[position++] = d;
            buffer[position++] = 0;
            buffer[position++] = tx;
            buffer[position++] = ty;
            buffer[position++] = 0;
        }

        index += 3;
    }

    return index;
};
