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
    x: number = 0,
    y: number = 0,
    position_x: number = 0,
    position_y: number = 0,
    line_width: number = 0,
    caps: string = "none"
): void => {

    graphics.xMin = Math.min(graphics.xMin, Math.min(x, position_x));
    graphics.xMax = Math.max(graphics.xMax, Math.max(x, position_x));
    graphics.yMin = Math.min(graphics.yMin, Math.min(y, position_y));
    graphics.yMax = Math.max(graphics.yMax, Math.max(y, position_y));

    // 始点 - 終点のベクトル
    const dx = position_x - x;
    const dy = position_y - y;

    // ベクトルの長さ
    const length = Math.sqrt(dx * dx + dy * dy);
    if (!length) {
        return ;
    }

    // 単位ベクトル
    const ux = dx / length;
    const uy = dy / length;
    const vx = -uy;
    const vy =  ux;

    // 線の太さの半分(半径)
    const r = line_width / 2;

    const xMin = Math.min(
        x + vx * r,
        x - vx * r,
        position_x + vx * r,
        position_x - vx * r
    );

    const xMax = Math.max(
        x + vx * r,
        x - vx * r,
        position_x + vx * r,
        position_x - vx * r
    );

    const yMin = Math.min(
        y + vy * r,
        y - vy * r,
        position_y + vy * r,
        position_y - vy * r
    );

    const yMax = Math.max(
        y + vy * r,
        y - vy * r,
        position_y + vy * r,
        position_y - vy * r
    );

    graphics.xMin = Math.min(graphics.xMin, xMin);
    graphics.xMax = Math.max(graphics.xMax, xMax);
    graphics.yMin = Math.min(graphics.yMin, yMin);
    graphics.yMax = Math.max(graphics.yMax, yMax);

    // case
    if (caps === "round" || caps === "square") {
        // 矩形キャップの中心点(ux, uyは逆ベクトルなのでマイナスで反転)
        const cxn = x + r * -ux;
        const cyn = y + r * -uy;

        const xMin = Math.min(
            cxn + r * ux + r * vx,
            cxn - r * ux + r * vx,
            cxn + r * ux - r * vx,
            cxn - r * ux - r * vx
        );

        const xMax = Math.max(
            cxn + r * ux + r * vx,
            cxn - r * ux + r * vx,
            cxn + r * ux - r * vx,
            cxn - r * ux - r * vx
        );
        const yMin = Math.min(
            cyn + r * uy + r * vy,
            cyn + r * uy - r * vy,
            cyn - r * uy - r * vy,
            cyn - r * uy + r * vy
        );
        const yMax = Math.max(
            cyn + r * uy + r * vy,
            cyn + r * uy - r * vy,
            cyn - r * uy - r * vy,
            cyn - r * uy + r * vy
        );

        graphics.xMin = Math.min(graphics.xMin, xMin);
        graphics.xMax = Math.max(graphics.xMax, xMax);
        graphics.yMin = Math.min(graphics.yMin, yMin);
        graphics.yMax = Math.max(graphics.yMax, yMax);
    }
};