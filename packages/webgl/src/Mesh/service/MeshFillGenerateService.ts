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

    const matrix = $context.$matrix;
    const width  = $getViewportWidth();
    const height = $getViewportHeight();

    const a  = matrix[0] / width;
    const b  = matrix[1] / width;
    const c  = matrix[3] / height;
    const d  = matrix[4] / height;
    const tx = matrix[6] / width;
    const ty = matrix[7] / height;

    const length = vertex.length - 5;
    for (let idx = 3; idx < length; idx += 3) {

        let position = index * 17;
        if (vertex[idx + 2]) {

            // 座標A
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

            // 座標B
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

            // 座標C
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

            // 座標A
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

            // 座標A
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