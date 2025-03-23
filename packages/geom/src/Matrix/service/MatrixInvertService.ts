import type { Matrix } from "../../Matrix";

/**
 * @description マトリックスを逆変換
 *              Invert the matrix
 *
 * @param  {Matrix} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix: Matrix): void =>
{
    const a: number  = matrix._$matrix[0];
    const b: number  = matrix._$matrix[1];
    const c: number  = matrix._$matrix[2];
    const d: number  = matrix._$matrix[3];
    const tx: number = matrix._$matrix[4];
    const ty: number = matrix._$matrix[5];

    if (b === 0 && c === 0) {

        matrix._$matrix[0]  = 1 / a;
        matrix._$matrix[1]  = 0;
        matrix._$matrix[2]  = 0;
        matrix._$matrix[3]  = 1 / d;
        matrix._$matrix[4] = -matrix._$matrix[0] * tx;
        matrix._$matrix[5] = -matrix._$matrix[3] * ty;

    } else {

        const det = a * d - b * c;

        if (det) {

            const rdet: number = 1 / det;

            matrix._$matrix[0]  = d  * rdet;
            matrix._$matrix[1]  = -b * rdet;
            matrix._$matrix[2]  = -c * rdet;
            matrix._$matrix[3]  = a  * rdet;
            matrix._$matrix[4] = -(matrix._$matrix[0] * tx + matrix._$matrix[2] * ty);
            matrix._$matrix[5] = -(matrix._$matrix[1] * tx + matrix._$matrix[3] * ty);

        }

    }
};