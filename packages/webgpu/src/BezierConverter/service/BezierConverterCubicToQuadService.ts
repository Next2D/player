/**
 * @description 3次ベジエを2次ベジエに近似
 *              Approximate cubic Bezier as quadratic Bezier
 *
 * @param  {number} p0x
 * @param  {number} p0y
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @param  {Float32Array} buffer
 * @param  {number} offset
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    _p0x: number, _p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    buffer: Float32Array,
    offset: number
): void => {
    // 3次ベジエの制御点から2次ベジエの制御点を近似
    // Q_control = (3*C1 - P0 + 3*C2 - P1) / 4
    // ただし、分割後は単純に中点を使用
    const cx = (p1x + p2x) * 0.5;
    const cy = (p1y + p2y) * 0.5;

    buffer[offset] = cx;
    buffer[offset + 1] = cy;
    buffer[offset + 2] = p3x;
    buffer[offset + 3] = p3y;
};
