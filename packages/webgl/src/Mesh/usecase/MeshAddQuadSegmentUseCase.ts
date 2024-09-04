import { execute as meshAddLineSegmentUseCase } from "./MeshAddLineSegmentUseCase";

/**
 * @description クワッドセグメントを追加
 *              Add a quad segment
 * 
 * @param  {number} x1 
 * @param  {number} y1 
 * @param  {number} cx 
 * @param  {number} cy 
 * @param  {number} x2 
 * @param  {number} y2 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x1: number, y1: number,
    cx: number, cy: number,
    x2: number, y2: number
): void => {

    const div = 11;

    let stx = x1;
    let sty = y1;
    for (let idx = 1; idx < div; idx++) {

        const t  = idx / div;
        const rt = 1 - t;

        const edx = (x1 * rt + cx * t) * rt + (cx * rt + x2 * t) * t;
        const edy = (y1 * rt + cy * t) * rt + (cy * rt + y2 * t) * t;

        meshAddLineSegmentUseCase(stx, sty, edx, edy, 2);

        stx = edx;
        sty = edy;
    }

    meshAddLineSegmentUseCase(stx, sty, x2, y2);
};