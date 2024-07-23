import type { Matrix } from "../../Matrix";

/**
 * @description Gradient用のMatrixを生成
 *              Create a Matrix for Gradient
 *
 * @param  {Matrix} matrix
 * @param  {number} width
 * @param  {number} height
 * @param  {number} [rotation=0]
 * @param  {number} [tx=0]
 * @param  {number} [ty=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    matrix: Matrix,
    width: number, height: number,
    rotation: number = 0,
    tx: number = 0, ty: number = 0
): void => {

    const array = matrix._$matrix;

    array[0] = width  / 1638.4;
    array[3] = height / 1638.4;

    if (rotation) {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        array[1] =  sin * array[3];
        array[2] = -sin * array[0];
        array[0] *= cos;
        array[3] *= cos;
    } else {
        array[1] = 0;
        array[2] = 0;
    }

    array[4] = tx + width  / 2;
    array[5] = ty + height / 2;
};