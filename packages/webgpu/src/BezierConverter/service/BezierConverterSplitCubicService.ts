/**
 * @description De Casteljauアルゴリズムで3次ベジエを分割
 *              Split cubic Bezier using De Casteljau algorithm
 *
 * @param  {number} p0x
 * @param  {number} p0y
 * @param  {number} p1x
 * @param  {number} p1y
 * @param  {number} p2x
 * @param  {number} p2y
 * @param  {number} p3x
 * @param  {number} p3y
 * @param  {number} t
 * @param  {Float32Array} left
 * @param  {Float32Array} right
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    t: number,
    left: Float32Array,
    right: Float32Array
): void => {
    const mt = 1 - t;

    // レベル1
    const q0x = mt * p0x + t * p1x;
    const q0y = mt * p0y + t * p1y;
    const q1x = mt * p1x + t * p2x;
    const q1y = mt * p1y + t * p2y;
    const q2x = mt * p2x + t * p3x;
    const q2y = mt * p2y + t * p3y;

    // レベル2
    const r0x = mt * q0x + t * q1x;
    const r0y = mt * q0y + t * q1y;
    const r1x = mt * q1x + t * q2x;
    const r1y = mt * q1y + t * q2y;

    // レベル3（分割点）
    const sx = mt * r0x + t * r1x;
    const sy = mt * r0y + t * r1y;

    // 左側のカーブ
    left[0] = p0x; left[1] = p0y;
    left[2] = q0x; left[3] = q0y;
    left[4] = r0x; left[5] = r0y;
    left[6] = sx;  left[7] = sy;

    // 右側のカーブ
    right[0] = sx;  right[1] = sy;
    right[2] = r1x; right[3] = r1y;
    right[4] = q2x; right[5] = q2y;
    right[6] = p3x; right[7] = p3y;
};
