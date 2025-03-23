import type { Matrix } from "../../Matrix";

/**
 * @description 指定のMatrixを連結
 *              Concatenate specified Matrix
 *
 * @param  {Matrix} matrix1
 * @param  {Matrix} matrix2
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix1: Matrix, matrix2: Matrix): void =>
{
    const matrixArray1 = matrix1._$matrix;
    const matrixArray2 = matrix2._$matrix;

    let a =  matrixArray1[0] * matrixArray2[0];
    let b =  0.0;
    let c =  0.0;
    let d =  matrixArray1[3] * matrixArray2[3];
    let tx = matrixArray1[4] * matrixArray2[0] + matrixArray2[4];
    let ty = matrixArray1[5] * matrixArray2[3] + matrixArray2[5];

    if (matrixArray1[1] || matrixArray1[2] || matrixArray2[1] || matrixArray2[2]) {
        a  += matrixArray1[1] * matrixArray2[2];
        d  += matrixArray1[2] * matrixArray2[1];
        b  += matrixArray1[0] * matrixArray2[1] + matrixArray1[1] * matrixArray2[3];
        c  += matrixArray1[2] * matrixArray2[0] + matrixArray1[3] * matrixArray2[2];
        tx += matrixArray1[5] * matrixArray2[2];
        ty += matrixArray1[4] * matrixArray2[1];
    }

    matrixArray1[0] = a;
    matrixArray1[1] = b;
    matrixArray1[2] = c;
    matrixArray1[3] = d;
    matrixArray1[4] = tx;
    matrixArray1[5] = ty;
};