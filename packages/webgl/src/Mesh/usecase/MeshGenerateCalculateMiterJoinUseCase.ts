import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";
import { execute as meshFindOverlappingPathsService } from "../service/MeshFindOverlappingPathsService";
import { execute as meshIsPointInsideRectangleService } from "../service/MeshIsPointInsideRectangleService";

/**
 * @description 線と線の繋ぎ目をmiterで繋ぐ
 *              Connect the connection between lines with miter
 *
 * @param  {IPoint} start_point
 * @param  {IPoint} end_point
 * @param  {IPoint} prev_point
 * @param  {number} r
 * @param  {IPath[]} rectangles
 * @param  {boolean} [is_last=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    start_point: IPoint,
    end_point: IPoint,
    prev_point: IPoint,
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

    const pathsA = meshFindOverlappingPathsService(start_point.x, start_point.y, r, rectangles[indexA]);
    const pathsB = meshFindOverlappingPathsService(start_point.x, start_point.y, r, rectangles[indexB]);

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

    // Miter join: 外側の点を延長して交点を求める
    const aVx = end_point.x - start_point.x;
    const aVy = end_point.y - start_point.y;
    const lengthA = Math.hypot(aVx, aVy);
    const normalizeA = {
        "x": aVx / lengthA,
        "y": aVy / lengthA
    };

    const bVx = prev_point.x - start_point.x;
    const bVy = prev_point.y - start_point.y;
    const lengthB = Math.hypot(bVx, bVy);
    const normalizeB = {
        "x": bVx / lengthB,
        "y": bVy / lengthB
    };

    const d1x = normalizeA.x, d1y = normalizeA.y;
    const d2x = normalizeB.x, d2y = normalizeB.y;

    const denom = d1x * d2y - d1y * d2x;
    if (denom === 0) {
        // 平行な場合は単純な三角形で接続
        rectangles.splice(-1, 0, [
            start_point.x, start_point.y, false,
            pointA[0], pointA[1], false,
            pointB[0], pointB[1], false
        ]);
        return;
    }

    const t = ((pointB[0] - pointA[0]) * d2y - (pointB[1] - pointA[1]) * d2x) / denom;

    const ix = pointA[0] + t * d1x;
    const iy = pointA[1] + t * d1y;

    rectangles.splice(-1, 0, [
        start_point.x, start_point.y, false,
        pointA[0], pointA[1], false,
        ix, iy, false,
        start_point.x, start_point.y, false,
        pointB[0], pointB[1], false,
        ix, iy, false
    ]);
};
