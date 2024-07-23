import { Matrix } from "../../Matrix";

/**
 * @description 指定のMatrixオブジェクトの値をコピー
 *              Copy the value of the specified Matrix object
 *
 * @param  {Matrix} dst
 * @param  {Matrix} src
 * @return {void}
 * @method
 * @public
 */
export const execute = (dst: Matrix, src: Matrix): void =>
{
    dst._$matrix[0] = src._$matrix[0];
    dst._$matrix[1] = src._$matrix[1];
    dst._$matrix[2] = src._$matrix[2];
    dst._$matrix[3] = src._$matrix[3];
    dst._$matrix[4] = src._$matrix[4];
    dst._$matrix[5] = src._$matrix[5];
};