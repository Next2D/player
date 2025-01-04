import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";
import { execute as meshFindOverlappingPathsUseCase } from "../service/MeshFindOverlappingPathsService";
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
    const pathsA = meshFindOverlappingPathsUseCase(start_point.x, start_point.y, r, rectangles[indexA]);
    const pathsB = meshFindOverlappingPathsUseCase(start_point.x, start_point.y, r, rectangles[indexB]);

    // パスが並行であれば終了
    if (pathsA[0] === pathsB[0] && pathsA[1] === pathsB[1]
        || pathsA[0] === pathsB[2] && pathsA[1] === pathsB[3]
    ) {
        return ;
    }

    const pointA = meshIsPointInsideRectangleService(
        pathsA, rectangles[indexB]
    );

    if (!pointA) {
        return ;
    }

    const pointB = meshIsPointInsideRectangleService(
        pathsB, rectangles[indexA]
    );

    if (!pointB) {
        return ;
    }

    // 1. ベクトルAB
    const ABx = pointB[0] - pointA[0];
    const ABy = pointB[1] - pointA[1];

    // 2. ベクトルAS
    const ASx = start_point.x - pointA[0];
    const ASy = start_point.y - pointA[1];

    // 3. 射影係数t = (AS・AB) / (AB・AB)
    const dotABAB = ABx * ABx + ABy * ABy;      // (AB・AB)
    const dotASAB = ASx * ABx + ASy * ABy;      // (AS・AB)
    const t1 = dotASAB / dotABAB;

    // 4. 足P = A + t * AB
    const px = pointA[0] + t1 * ABx;
    const py = pointA[1] + t1 * ABy;

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
        rectangles.splice(-1, 0, [
            start_point.x, start_point.y, false,
            pointA[0], pointA[1], false,
            pointB[0], pointB[1], false
        ]);
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
        ix, iy, false,
    ]);
};