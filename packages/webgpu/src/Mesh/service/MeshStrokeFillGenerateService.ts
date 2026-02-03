import type { IPath } from "../../interface/IPath";

/**
 * @description ストローク塗りつぶし用のメッシュを生成する（bezier座標は常に0.5, 0.5）
 *              Generate a mesh for stroke fill (bezier coordinates are always 0.5, 0.5)
 *
 * ストロークの輪郭は閉じたパスとして全体を塗りつぶす必要があるため、
 * Loop-BlinnのBezierチェックは不要。すべてのbezier座標を (0.5, 0.5) に設定して
 * シェーダーのdiscard条件 (f = u*u - v >= 0) を回避する。
 * f = 0.5 * 0.5 - 0.5 = -0.25 < 0 なので、常に描画される。
 *
 * 頂点フォーマット（17 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - 常に (0.5, 0.5) を設定
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
            // 曲線セグメント: 3つの頂点を出力（始点、制御点、終点で三角形）
            // bezier座標は常に (0.5, 0.5) に設定

            // 座標A (始点)
            buffer[position++] = vertex[idx - 3] as number;
            buffer[position++] = vertex[idx - 2] as number;
            buffer[position++] = 0.5;  // bezier.u
            buffer[position++] = 0.5;  // bezier.v

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

            // 座標B (制御点)
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;  // bezier.u
            buffer[position++] = 0.5;  // bezier.v

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

            // 座標C (終点)
            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 0.5;  // bezier.u
            buffer[position++] = 0.5;  // bezier.v

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
            // 次が曲線: 基点と現在点と次の次の点で三角形

            // 座標A (基点)
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

            // 座標B (現在点)
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

            // 座標C (次の次の点)
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
            // 直線セグメント: 基点と現在点と次の点で三角形

            // 座標A (基点)
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

            // 座標B (現在点)
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

            // 座標C (次の点)
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
