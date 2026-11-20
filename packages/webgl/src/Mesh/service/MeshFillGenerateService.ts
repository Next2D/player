import type { IPath } from "../../interface/IPath";

/**
 * @description 1頂点あたりの要素数 (座標 2 + ベジェ係数 2 + 色 4 + 行列 9)
 *              Values per vertex (position 2, Bezier coefficients 2, color 4, matrix 9)
 *
 * @type {number}
 * @const
 */
const VERTEX_SIZE: number = 17;

/**
 * @description 三角形 1 つあたりの要素数
 *              Values per triangle
 *
 * @type {number}
 * @const
 */
const TRIANGLE_SIZE: number = VERTEX_SIZE * 3;

/**
 * @description 三角形 1 つ分のひな形。色と行列は 3 頂点とも同じ値なので、呼び出しごとに 1 度だけ
 *              ここへ書き、三角形ごとにまとめて複写する。座標とベジェ係数だけを後から書き込む。
 *              Template for one triangle. Color and matrix are the same for all three vertices, so they
 *              are written here once per call and copied in one go per triangle; only the positions and
 *              Bezier coefficients are written afterwards.
 *
 * @type {Float32Array}
 * @private
 */
const $template: Float32Array = new Float32Array(TRIANGLE_SIZE);

/**
 * @description 塗りのメッシュを生成する
 *              Generate a fill mesh
 *
 *              パスの 1 点ごとに三角形を 1 つ出力する (曲線は制御点を挟む 3 点、直線は始点からの扇形)。
 *              図形を初めて描くときに全頂点を書き込むため、要素を 1 つずつ代入すると頂点数に比例して
 *              時間がかかる。色と行列はひな形から複写し、頂点ごとに異なる値だけを書く。
 *
 *              Emits one triangle per path point (three points around the control point for a curve,
 *              a fan from the first point for a line). Every vertex is written the first time a shape is
 *              drawn, so assigning the values one by one costs time in proportion to the vertex count.
 *              Color and matrix are copied from the template and only per-vertex values are written.
 *
 * @param  {IPath} vertex
 * @param  {Float32Array} buffer
 * @param  {number} index
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @param  {number} tx
 * @param  {number} ty
 * @param  {number} red
 * @param  {number} green
 * @param  {number} blue
 * @param  {number} alpha
 * @return {number}
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

    const template = $template;
    for (let offset = 0; offset < TRIANGLE_SIZE; offset += VERTEX_SIZE) {
        template[offset + 4]  = red;
        template[offset + 5]  = green;
        template[offset + 6]  = blue;
        template[offset + 7]  = alpha;
        template[offset + 8]  = a;
        template[offset + 9]  = b;
        template[offset + 10] = 0;
        template[offset + 11] = c;
        template[offset + 12] = d;
        template[offset + 13] = 0;
        template[offset + 14] = tx;
        template[offset + 15] = ty;
        template[offset + 16] = 0;
    }

    const length = vertex.length - 5;
    const limit  = buffer.length - TRIANGLE_SIZE;
    for (let idx = 3; idx < length; idx += 3) {

        const position = index * VERTEX_SIZE;

        // 色と行列を 3 頂点分まとめて複写する (バッファに収まらない場合は入る分だけ書く)
        if (position <= limit) {
            buffer.set(template, position);
        } else {
            for (let offset = 0; offset < TRIANGLE_SIZE; ++offset) {
                buffer[position + offset] = template[offset];
            }
        }

        if (vertex[idx + 2]) {
            // 曲線: 始点 (0, 0)、制御点 (0.5, 0)、終点 (1, 1)
            buffer[position]      = vertex[idx - 3] as number;
            buffer[position + 1]  = vertex[idx - 2] as number;
            buffer[position + 2]  = 0;
            buffer[position + 3]  = 0;

            buffer[position + 17] = vertex[idx] as number;
            buffer[position + 18] = vertex[idx + 1] as number;
            buffer[position + 19] = 0.5;
            buffer[position + 20] = 0;

            buffer[position + 34] = vertex[idx + 3] as number;
            buffer[position + 35] = vertex[idx + 4] as number;
            buffer[position + 36] = 1;
            buffer[position + 37] = 1;
        } else {
            // 直線: 先頭の点からの扇形。次の点が制御点なら、その先の終点と結ぶ
            const next = vertex[idx + 5] ? idx + 6 : idx + 3;

            buffer[position]      = vertex[0] as number;
            buffer[position + 1]  = vertex[1] as number;
            buffer[position + 2]  = 0.5;
            buffer[position + 3]  = 0.5;

            buffer[position + 17] = vertex[idx] as number;
            buffer[position + 18] = vertex[idx + 1] as number;
            buffer[position + 19] = 0.5;
            buffer[position + 20] = 0.5;

            buffer[position + 34] = vertex[next] as number;
            buffer[position + 35] = vertex[next + 1] as number;
            buffer[position + 36] = 0.5;
            buffer[position + 37] = 0.5;
        }

        index += 3;
    }

    return index;
};
