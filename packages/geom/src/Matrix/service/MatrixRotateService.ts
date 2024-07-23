import type { Matrix } from "../../Matrix";

/**
 * @description マトリックスの回転変換
 *              Rotate transformation of matrix
 *
 * @param  {Matrix} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix: Matrix, rotation: number): void =>
{
    const array = matrix._$matrix;

    const a  = array[0];
    const b  = array[1];
    const c  = array[2];
    const d  = array[3];
    const tx = array[4];
    const ty = array[5];

    array[0] = a  * Math.cos(rotation) - b  * Math.sin(rotation);
    array[1] = a  * Math.sin(rotation) + b  * Math.cos(rotation);
    array[2] = c  * Math.cos(rotation) - d  * Math.sin(rotation);
    array[3] = c  * Math.sin(rotation) + d  * Math.cos(rotation);
    array[4] = tx * Math.cos(rotation) - ty * Math.sin(rotation);
    array[5] = tx * Math.sin(rotation) + ty * Math.cos(rotation);
};