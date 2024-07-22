import { Matrix } from "../../Matrix";

/**
 * @description 指定のMatrixオブジェクトのクローンを生成して返却
 *              Generate and return a clone of the specified Matrix object
 *
 * @param  {Matrix} matrix
 * @return {Matrix}
 * @method
 * @public
 */
export const execute = (matrix: Matrix): Matrix =>
{
    return new Matrix(
        matrix._$matrix[0], matrix._$matrix[1],
        matrix._$matrix[2], matrix._$matrix[3],
        matrix._$matrix[4], matrix._$matrix[5]
    );
};