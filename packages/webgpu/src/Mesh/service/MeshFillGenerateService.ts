import type { IPath } from "../../interface/IPath";

/**
 * @description 塗りのメッシュを生成する（Loop-Blinn方式対応）
 *              Generate a fill mesh with Loop-Blinn method support
 *
 * 頂点フォーマット（4 floats per vertex）:
 * - position: x, y (2 floats)
 * - bezier: u, v (2 floats) - Loop-Blinn用の暗黙的関数座標
 *
 * color/matrixはuniform bufferで供給される
 *
 * @param  {IPath} vertex - 頂点パスデータ / Vertex path data
 * @param  {Float32Array} buffer - 出力先バッファ / Output buffer
 * @param  {number} index - 現在の頂点インデックス / Current vertex index
 * @return {number} 新しい頂点インデックス / New vertex index
 * @method
 * @protected
 */
export const execute = (
    vertex: IPath,
    buffer: Float32Array,
    index: number
): number => {

    const length = vertex.length - 5;

    for (let idx = 3; idx < length; idx += 3) {

        let position = index * 4;

        if (vertex[idx + 2]) {

            // 座標A
            buffer[position++] = vertex[idx - 3] as number;
            buffer[position++] = vertex[idx - 2] as number;
            buffer[position++] = 0;
            buffer[position++] = 0;

            // 座標B
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0;

            // 座標C
            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 1;
            buffer[position++] = 1;

        } else if (vertex[idx + 5]) {

            // 座標A
            buffer[position++] = vertex[0] as number;
            buffer[position++] = vertex[1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            // 座標B
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            // 座標C
            buffer[position++] = vertex[idx + 6] as number;
            buffer[position++] = vertex[idx + 7] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

        } else {

            // 座標A
            buffer[position++] = vertex[0] as number;
            buffer[position++] = vertex[1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            // 座標B
            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            // 座標C
            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;
        }

        index += 3;
    }

    return index;
};
