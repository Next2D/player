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
    // 経路の点ごとに呼ばれるので、Math.min / Math.max の呼び出しを避けて比較で求める。
    // 結果は、線分の 4 隅 (と、キャップの 4 隅) の最小・最大を取る以前の計算と同じ値になる:
    //   min(x + a, x - a, px + a, px - a) = min(x, px) - |a|
    //   min(c ± a ± b)                    = c - |a| - |b|
    let xMin = graphics.xMin;
    let xMax = graphics.xMax;
    let yMin = graphics.yMin;
    let yMax = graphics.yMax;

    // 始点と終点
    let lowX  = x;
    let highX = position_x;
    if (position_x < x) {
        lowX  = position_x;
        highX = x;
    }

    let lowY  = y;
    let highY = position_y;
    if (position_y < y) {
        lowY  = position_y;
        highY = y;
    }

    if (lowX < xMin) {
        xMin = lowX;
    }
    if (highX > xMax) {
        xMax = highX;
    }
    if (lowY < yMin) {
        yMin = lowY;
    }
    if (highY > yMax) {
        yMax = highY;
    }

    // 始点 - 終点のベクトル
    const dx = position_x - x;
    const dy = position_y - y;

    // ベクトルの長さ
    const length = Math.sqrt(dx * dx + dy * dy);
    if (!length) {
        graphics.xMin = xMin;
        graphics.xMax = xMax;
        graphics.yMin = yMin;
        graphics.yMax = yMax;
        return ;
    }

    // 単位ベクトル
    const ux = dx / length;
    const uy = dy / length;
    const vx = -uy;
    const vy =  ux;

    // 線の太さの半分(半径)
    const r = line_width / 2;

    // 線の太さの分だけ、法線方向に広げる
    let normalX = vx * r;
    if (normalX < 0) {
        normalX = -normalX;
    }

    let normalY = vy * r;
    if (normalY < 0) {
        normalY = -normalY;
    }

    if (lowX - normalX < xMin) {
        xMin = lowX - normalX;
    }
    if (highX + normalX > xMax) {
        xMax = highX + normalX;
    }
    if (lowY - normalY < yMin) {
        yMin = lowY - normalY;
    }
    if (highY + normalY > yMax) {
        yMax = highY + normalY;
    }

    // case
    if (caps === "round" || caps === "square") {
        // 矩形キャップの中心点(ux, uyは逆ベクトルなのでマイナスで反転)
        const cxn = x + r * -ux;
        const cyn = y + r * -uy;

        let tangentX = r * ux;
        if (tangentX < 0) {
            tangentX = -tangentX;
        }

        let tangentY = r * uy;
        if (tangentY < 0) {
            tangentY = -tangentY;
        }

        if (cxn - tangentX - normalX < xMin) {
            xMin = cxn - tangentX - normalX;
        }
        if (cxn + tangentX + normalX > xMax) {
            xMax = cxn + tangentX + normalX;
        }
        if (cyn - tangentY - normalY < yMin) {
            yMin = cyn - tangentY - normalY;
        }
        if (cyn + tangentY + normalY > yMax) {
            yMax = cyn + tangentY + normalY;
        }
    }

    graphics.xMin = xMin;
    graphics.xMax = xMax;
    graphics.yMin = yMin;
    graphics.yMax = yMax;
};