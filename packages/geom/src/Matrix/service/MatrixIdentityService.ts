import type { Matrix } from "../../Matrix";

/**
 * @description Matrixの値を初期化
 *              Initialize Matrix values
 *
 * @param  {Matrix} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix: Matrix): void =>
{
    matrix._$matrix[0] = 1;
    matrix._$matrix[1] = 0;
    matrix._$matrix[2] = 0;
    matrix._$matrix[3] = 1;
    matrix._$matrix[4] = 0;
    matrix._$matrix[5] = 0;
};