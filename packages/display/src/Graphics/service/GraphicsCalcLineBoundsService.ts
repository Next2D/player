import type { Graphics } from "../../Graphics";

/**
 * @description 線の描画範囲を計算
 *              Calculate the stroke drawing range
 * 
 * @param  {Graphics} graphics
 * @param  {number} x
 * @param  {number} y
 * @param  {number} position_x
 * @param  {number} position_y
 * @param  {number} line_width
 * @param  {string} caps
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    graphics: Graphics, 
    x: number = 0, y: number = 0,
    position_x: number = 0, position_y: number = 0,
    line_width: number = 0, caps: string = "none"
): void => {

    graphics.xMin = Math.min(graphics.xMin, Math.min(x, position_x));
    graphics.xMax = Math.max(graphics.xMax, Math.max(x, position_x));
    graphics.yMin = Math.min(graphics.yMin, Math.min(y, position_y));
    graphics.yMax = Math.max(graphics.yMax, Math.max(y, position_y));

    // correction
    const half: number     = line_width / 2;
    const radian90: number = 0.5 * Math.PI;
    const radian1: number  = Math.atan2(y - position_y, x - position_x); // to end point
    const radian2: number  = Math.atan2(position_y - y, position_x - x); // to start point
    const radian3: number  = radian1 + radian90;
    const radian4: number  = radian1 - radian90;
    const radian5: number  = radian2 + radian90;
    const radian6: number  = radian2 - radian90;

    // init
    let x1: number = x + half;
    let x2: number = -half + x;
    let x3: number = position_x + half;
    let x4: number = -half + position_x;
    let y1: number = y + half;
    let y2: number = -half + y;
    let y3: number = position_y + half;
    let y4: number = -half + position_y;

    graphics.xMin = Math.min(graphics.xMin, Math.min(x1, Math.min(x2, Math.min(x3, x4))));
    graphics.xMax = Math.max(graphics.xMax, Math.max(x1, Math.max(x2, Math.max(x3, x4))));
    graphics.yMin = Math.min(graphics.yMin, Math.min(y1, Math.min(y2, Math.min(y3, y4))));
    graphics.yMax = Math.max(graphics.yMax, Math.max(y1, Math.max(y2, Math.max(y3, y4))));

    // pointer x
    if (Math.abs(radian3) % radian90 !== 0) {
        x1 = x + Math.cos(radian3) * half;
    }

    if (Math.abs(radian4) % radian90 !== 0) {
        x2 = x + Math.cos(radian4) * half;
    }

    if (Math.abs(radian5) % radian90 !== 0) {
        x3 = position_x + Math.cos(radian5) * half;
    }

    if (Math.abs(radian6) % radian90 !== 0) {
        x4 = position_x + Math.cos(radian6) * half;
    }

    // pointer y
    if (radian3 && Math.abs(radian3) % Math.PI !== 0) {
        y1 = y + Math.sin(radian3) * half;
    }

    if (radian4 && Math.abs(radian4) % Math.PI !== 0) {
        y2 = y + Math.sin(radian4) * half;
    }

    if (radian5 && Math.abs(radian5) % Math.PI !== 0) {
        y3 = position_y + Math.sin(radian5) * half;
    }

    if (radian6 && Math.abs(radian6) % Math.PI !== 0) {
        y4 = position_y + Math.sin(radian6) * half;
    }

    graphics.xMin = Math.min(graphics.xMin, Math.min(x1, Math.min(x2, Math.min(x3, x4))));
    graphics.xMax = Math.max(graphics.xMax, Math.max(x1, Math.max(x2, Math.max(x3, x4))));
    graphics.yMin = Math.min(graphics.yMin, Math.min(y1, Math.min(y2, Math.min(y3, y4))));
    graphics.yMax = Math.max(graphics.yMax, Math.max(y1, Math.max(y2, Math.max(y3, y4))));

    // case
    switch (caps) {

        case "round":

            if (Math.abs(radian1) % radian90 !== 0) {
                const rx1: number = x + Math.cos(radian1) * half;
                graphics.xMin = Math.min(graphics.xMin, rx1);
                graphics.xMax = Math.max(graphics.xMax, rx1);
            }

            if (radian1 && Math.abs(radian1) % Math.PI !== 0) {
                const ry1: number = y + Math.sin(radian1) * half;
                graphics.yMin = Math.min(graphics.yMin, ry1);
                graphics.yMax = Math.max(graphics.yMax, ry1);
            }

            if (Math.abs(radian2) % radian90 !== 0) {
                const rx2: number = position_x + Math.cos(radian2) * half;
                graphics.xMin = Math.min(graphics.xMin, rx2);
                graphics.xMax = Math.max(graphics.xMax, rx2);
            }

            if (radian2 && Math.abs(radian2) % Math.PI !== 0) {
                const ry2: number = position_y + Math.sin(radian2) * half;
                graphics.yMin = Math.min(graphics.yMin, ry2);
                graphics.yMax = Math.max(graphics.yMax, ry2);
            }

            break;

        case "square":

            if (Math.abs(radian1) % radian90 !== 0) {
                const r1cos: number = Math.cos(radian1) * half;
                const rx1: number = x1 + r1cos;
                const rx2: number = x2 + r1cos;
                graphics.xMin = Math.min(graphics.xMin, Math.min(rx1, rx2));
                graphics.xMax = Math.max(graphics.xMax, Math.max(rx1, rx2));
            }

            if (Math.abs(radian2) % radian90 !== 0) {
                const r2cos: number = Math.cos(radian2) * half;
                const rx3: number = x3 + r2cos;
                const rx4: number = x4 + r2cos;
                graphics.xMin = Math.min(graphics.xMin, Math.min(rx3, rx4));
                graphics.xMax = Math.max(graphics.xMax, Math.max(rx3, rx4));
            }

            if (radian1 && Math.abs(radian1) % Math.PI !== 0) {
                const r1sin: number = Math.sin(radian1) * half;
                const ry1: number = y1 + r1sin;
                const ry2: number = y2 + r1sin;
                graphics.yMin = Math.min(graphics.yMin, Math.min(ry1, ry2));
                graphics.yMax = Math.max(graphics.yMax, Math.max(ry1, ry2));
            }

            if (radian2 && Math.abs(radian2) % Math.PI !== 0) {
                const r2sin: number = Math.sin(radian2) * half;
                const ry3: number = y3 + r2sin;
                const ry4: number = y4 + r2sin;
                graphics.yMin = Math.min(graphics.yMin, Math.min(ry3, ry4));
                graphics.yMax = Math.max(graphics.yMax, Math.max(ry3, ry4));
            }

            break;

        default:
            break;

    }
};