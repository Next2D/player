import type { IPath } from "../../interface/IPath";
import { execute as meshFindOverlappingPathsService } from "../service/MeshFindOverlappingPathsService";
import { execute as meshIsPointInsideRectangleService } from "../service/MeshIsPointInsideRectangleService";

/**
 * @description 線と線の繋ぎ目を丸くする
 *              Make the connection between lines round
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} r
 * @param  {IPath[]} rectangles
 * @param  {boolean} [is_last=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    r: number,
    rectangles: IPath[],
    is_last: boolean = false
): void => {

    const indexA = is_last ? 0 : rectangles.length - 1;
    const indexB = is_last ? rectangles.length - 1 : rectangles.length - 2;

    // 曲線矩形同士の接合ではjoinを追加しない
    // 曲線は滑らかに接続されているため、joinジオメトリは不要
    const isRectACurve = rectangles[indexA].length > 15;
    const isRectBCurve = rectangles[indexB].length > 15;
    if (isRectACurve && isRectBCurve) {
        return;
    }

    const pathsA = meshFindOverlappingPathsService(x, y, r, rectangles[indexA]);
    const pathsB = meshFindOverlappingPathsService(x, y, r, rectangles[indexB]);

    const pointA = meshIsPointInsideRectangleService(pathsA, rectangles[indexB]);
    if (!pointA) {
        return;
    }

    const pointB = meshIsPointInsideRectangleService(pathsB, rectangles[indexA]);
    if (!pointB) {
        return;
    }

    const angleA = Math.atan2(pointA[1] - y, pointA[0] - x);
    const angleB = Math.atan2(pointB[1] - y, pointB[0] - x);

    // 角度差を正規化して180度以下にする
    let angleDiff = angleB - angleA;
    if (angleDiff > Math.PI) {
        angleDiff -= 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
        angleDiff += 2 * Math.PI;
    }

    // 角度差が小さい場合または180度に近い場合はスキップ
    // 小さい角度差: 曲線の閉じたパスでは不要
    // 180度に近い場合: 外側と内側の点を間違えて選んでいる
    const absAngleDiff = Math.abs(angleDiff);
    if (absAngleDiff < 0.1 || absAngleDiff > Math.PI - 0.1) {
        return;
    }

    const segment = 8;
    const step = angleDiff / segment;

    const points: IPath = [x, y, false];
    for (let idx = 0; idx <= segment; idx++) {
        const angle = angleA + idx * step;
        const dx = x + r * Math.cos(angle);
        const dy = y + r * Math.sin(angle);
        points.push(dx, dy, false);
    }

    rectangles.splice(-1, 0, points);
};
