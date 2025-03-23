import { $bezierBuffer } from "../../BezierConverter";

/**
 * @description 3次ベジェに分割
 *              Split cubic Bezier
 *
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} p4
 * @param  {number} p5
 * @param  {number} p6
 * @param  {number} p7
 * @param  {number} offset1
 * @param  {number} offset2
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    p0: number, p1: number,
    p2: number, p3: number,
    p4: number, p5: number,
    p6: number, p7: number,
    offset1: number, offset2: number
): void => {

    const mx: number = (p0 + 3 * (p2 + p4) + p6) * 0.125;
    const my: number = (p1 + 3 * (p3 + p5) + p7) * 0.125;
    const dx: number = (p6 + p4 - p2 - p0) * 0.125;
    const dy: number = (p7 + p5 - p3 - p1) * 0.125;

    $bezierBuffer[offset1    ] = p0;
    $bezierBuffer[offset1 + 1] = p1;
    $bezierBuffer[offset1 + 2] = (p0 + p2) * 0.5;
    $bezierBuffer[offset1 + 3] = (p1 + p3) * 0.5;
    $bezierBuffer[offset1 + 4] = mx - dx;
    $bezierBuffer[offset1 + 5] = my - dy;
    $bezierBuffer[offset1 + 6] = mx;
    $bezierBuffer[offset1 + 7] = my;

    $bezierBuffer[offset2    ] = mx;
    $bezierBuffer[offset2 + 1] = my;
    $bezierBuffer[offset2 + 2] = mx + dx;
    $bezierBuffer[offset2 + 3] = my + dy;
    $bezierBuffer[offset2 + 4] = (p4 + p6) * 0.5;
    $bezierBuffer[offset2 + 5] = (p5 + p7) * 0.5;
    $bezierBuffer[offset2 + 6] = p6;
    $bezierBuffer[offset2 + 7] = p7;
};