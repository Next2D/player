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
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    r: number,
    rectangles: IPath[]
): void => {

    const length = rectangles.length;
    const pathsA = meshFindOverlappingPathsService(x, y, r, rectangles[length - 1]);
    const pathsB = meshFindOverlappingPathsService(x, y, r, rectangles[length - 2]);

    const pointA = meshIsPointInsideRectangleService(
        pathsA, rectangles[length - 2]
    );

    // 接続点が矩形の内部にある場合は終了
    if (!pointA) {
        return ;
    }

    const pointB = meshIsPointInsideRectangleService(
        pathsB, rectangles[length - 1]
    );

    // 接続点が矩形の内部にある場合は終了
    if (!pointB) {
        return ;
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