/**
 * @description 2次ベジェを分割
 *              Split quadratic Bezier
 * 
 * @param  {number} bezier_buffer 
 * @param  {number} p0 
 * @param  {number} p1 
 * @param  {number} p2 
 * @param  {number} p3 
 * @param  {number} p4 
 * @param  {number} p5 
 * @param  {number} p6 
 * @param  {number} p7 
 * @param  {number} offset 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    bezier_buffer: Float32Array,
    p0: number, p1: number,
    p2: number, p3: number,
    p4: number, p5: number,
    p6: number, p7: number,
    offset: number
): void => {

    const mx: number = (p0 + 3 * (p2 + p4) + p6) * 0.125;
    const my: number = (p1 + 3 * (p3 + p5) + p7) * 0.125;

    // 2次ベジェの始点の値は不要なので含めない

    bezier_buffer[offset    ] = p0 * 0.25 + p2 * 0.75;
    bezier_buffer[offset + 1] = p1 * 0.25 + p3 * 0.75;
    bezier_buffer[offset + 2] = mx;
    bezier_buffer[offset + 3] = my;

    bezier_buffer[offset + 4] = p4 * 0.75 + p6 * 0.25;
    bezier_buffer[offset + 5] = p5 * 0.75 + p7 * 0.25;
    bezier_buffer[offset + 6] = p6;
    bezier_buffer[offset + 7] = p7;
};