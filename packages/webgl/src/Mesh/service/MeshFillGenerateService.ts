import type { IPath } from "../../interface/IPath";
import {
    $context,
    $getViewportWidth,
    $getViewportHeight
} from "../../WebGLUtil";

/**
 * @description 塗りのメッシュを生成する
 *              Generate a fill mesh
 *
 * @param  {IPath} vertex
 * @param  {Float32Array} buffer
 * @param  {number} index
 * @return {number}
 * @method
 * @protected
 */
export const execute = (vertex: IPath, buffer: Float32Array, index: number): number =>
{
    const red   = $context.$fillStyle[0];
    const green = $context.$fillStyle[1];
    const blue  = $context.$fillStyle[2];
    const alpha = $context.$fillStyle[3];

    const matrix = $context.$matrix.slice();
    const width  = $getViewportWidth();
    const height = $getViewportHeight();
    matrix[0] /= width;
    matrix[1] /= width;
    matrix[3] /= height;
    matrix[4] /= height;
    matrix[6] /= width;
    matrix[7] /= height;

    const length: number = vertex.length - 5;
    for (let idx: number = 3; idx < length; idx += 3) {

        let position: number = index * 17;
        if (vertex[idx + 2]) {

            buffer[position++] = vertex[idx - 3] as number;
            buffer[position++] = vertex[idx - 2] as number;
            buffer[position++] = 0;
            buffer[position++] = 0;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 1;
            buffer[position++] = 1;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

        } else if (vertex[idx + 5]) {

            buffer[position++] = vertex[0] as number;
            buffer[position++] = vertex[1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

            buffer[position++] = vertex[idx + 6] as number;
            buffer[position++] = vertex[idx + 7] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

        } else {

            buffer[position++] = vertex[0] as number;
            buffer[position++] = vertex[1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

            buffer[position++] = vertex[idx] as number;
            buffer[position++] = vertex[idx + 1] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;

            buffer[position++] = vertex[idx + 3] as number;
            buffer[position++] = vertex[idx + 4] as number;
            buffer[position++] = 0.5;
            buffer[position++] = 0.5;

            buffer[position++] = red;
            buffer[position++] = green;
            buffer[position++] = blue;
            buffer[position++] = alpha;

            buffer[position++] = matrix[0];
            buffer[position++] = matrix[1];
            buffer[position++] = 0;
            buffer[position++] = matrix[3];
            buffer[position++] = matrix[4];
            buffer[position++] = 0;
            buffer[position++] = matrix[6];
            buffer[position++] = matrix[7];
            buffer[position++] = 0;
        }

        index += 3;
    }

    return index;
};