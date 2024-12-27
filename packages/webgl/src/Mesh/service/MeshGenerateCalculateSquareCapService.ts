import type { IPath } from "../../interface/IPath";

/**
 * @description 始点、終点から終点の反対側の矩形のパスを算出
 *              Calculate the path of the rectangle on the opposite side of the end point from the start point
 *
 * @param  {IPath} vertices
 * @param  {number} r
 * @param  {IPath[]} rectangles
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    vertices: IPath,
    r: number,
    rectangles: IPath[]
): void => {

    for (let idx = 0; idx < 2; ++idx) {

        let sx = 0;
        let sy = 0;
        let ex = 0;
        let ey = 0;

        if (idx === 0) {
            sx = vertices[0] as number;
            sy = vertices[1] as number;
            ex = vertices[3] as number;
            ey = vertices[4] as number;
        } else {
            sx = vertices[vertices.length - 3] as number;
            sy = vertices[vertices.length - 2] as number;
            ex = vertices[vertices.length - 6] as number;
            ey = vertices[vertices.length - 5] as number;
        }

        // 「アンカー -> コントロール」のベクトル(dx, dy)
        const dx = -(ex - sx);
        const dy = -(ey - sy);

        // ベクトル(dx, dy) の長さ
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) {
            // アンカーとコントロールが同じ場合はベクトルが作れない
            continue ;
        }

        // 正規化 (長さ1にする)
        const ux = dx / length;
        const uy = dy / length;

        // 矩形キャップの中心点
        //     → アンカー(ax, ay) から 逆方向ベクトルに r 分進めた場所
        const cxn = sx + r * ux;
        const cyn = sy + r * uy;

        // 垂直ベクトル
        const vx = -uy;
        const vy =  ux;

        const points: IPath = [
            cxn + r * ux + r * vx, cyn + r * uy + r * vy, false, // 1
            cxn + r * ux - r * vx, cyn + r * uy - r * vy, false, // 2
            cxn - r * ux - r * vx, cyn - r * uy - r * vy, false, // 3
            cxn + r * ux + r * vx, cyn + r * uy + r * vy, false, // 1
            cxn - r * ux - r * vx, cyn - r * uy - r * vy, false, // 3
            cxn - r * ux + r * vx, cyn - r * uy + r * vy, false  // 4
        ];

        if (idx === 0) {
            rectangles.unshift(points);
        } else {
            rectangles.push(points);
        }
    }
};