/**
 * @description 2D変換行列を設定します
 *              Set the 2D transformation matrix
 *
 * @param  {Float32Array} matrix
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @param  {number} e
 * @param  {number} f
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    matrix: Float32Array,
    a: number, b: number, c: number,
    d: number, e: number, f: number
): void => {
    matrix[0] = a;
    matrix[1] = b;
    matrix[3] = c;
    matrix[4] = d;
    matrix[6] = e;
    matrix[7] = f;
};