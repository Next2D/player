import type { IPath } from "../../interface/IPath";
import { execute as meshFindOverlappingPathsService } from "../service/MeshFindOverlappingPathsService";
import { execute as meshIsPointInsideRectangleService } from "../service/MeshIsPointInsideRectangleService";

/**
 * @description 線と線の繋ぎ目を繋ぐ
 *              Connect the connection between lines
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

    // パスが並行であれば終了
    if (pathsA[0] === pathsB[0] && pathsA[1] === pathsB[1]
        || pathsA[0] === pathsB[2] && pathsA[1] === pathsB[3]
    ) {
        return;
    }

    // 矩形Aの点が矩形Bの外にあるか確認
    const pointA = meshIsPointInsideRectangleService(pathsA, rectangles[indexB]);
    if (!pointA) {
        // 全ての点が矩形B内にある = 隙間がない
        return;
    }

    // 矩形Bの点が矩形Aの外にあるか確認
    const pointB = meshIsPointInsideRectangleService(pathsB, rectangles[indexA]);
    if (!pointB) {
        // 全ての点が矩形A内にある = 隙間がない
        return;
    }

    // 隙間がある場合のみbevel joinを追加
    rectangles.splice(-1, 0, [
        x, y, false,
        pointA[0], pointA[1], false,
        pointB[0], pointB[1], false,
        x, y, false
    ]);
};
