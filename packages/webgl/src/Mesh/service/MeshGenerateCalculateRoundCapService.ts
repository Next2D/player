import type { IPath } from "../../interface/IPath";

/**
 * @description 始点、終点から終点の反対側の線の丸みを算出
 *              Calculate the roundness of the line on the opposite side of the end point from the start point
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

        const dx = ex - sx;
        const dy = ey - sy;

        const angleToEnd = Math.atan2(dy, dx);
        const startAngle = angleToEnd + Math.PI / 2;// 反対側
        const endAngle   = angleToEnd - Math.PI / 2;

        const segments = 16;
        const step = (endAngle - startAngle) / segments;

        const points: IPath = [];
        for (let idx = 0; idx <= segments; idx++) {
            const t = endAngle + step * idx;
            const x = sx + r * Math.cos(t);
            const y = sy + r * Math.sin(t);
            points.push(x, y, false);
        }

        if (idx === 0) {
            rectangles.unshift(points);
        } else {
            rectangles.push(points);
        }
    }
};