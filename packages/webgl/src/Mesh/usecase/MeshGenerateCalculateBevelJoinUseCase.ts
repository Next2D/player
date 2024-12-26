import type { IPath } from "../../interface/IPath";
import { execute as meshFindOverlappingPathsUseCase } from "../service/MeshFindOverlappingPathsService";
import { execute as meshIsPointInsideRectangleService } from "../service/MeshIsPointInsideRectangleService";

/**
 * @description 線と線の繋ぎ目を繋ぐ
 *              Connect the connection between lines
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {IPath[]} rectangles
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x: number,
    y: number,
    rectangles: IPath[]
): void => {

    const length = rectangles.length;
    const pathsA = meshFindOverlappingPathsUseCase(x, y, rectangles[length - 1]);
    const pathsB = meshFindOverlappingPathsUseCase(x, y, rectangles[length - 2]);

    // パスが並行であれば終了
    if (pathsA[0] === pathsB[0] && pathsA[1] === pathsB[1]
        || pathsA[0] === pathsB[2] && pathsA[1] === pathsB[3]
    ) {
        return ;
    }

    const pointA = meshIsPointInsideRectangleService(
        pathsA, rectangles[length - 2]
    );

    if (!pointA) {
        return ;
    }

    const pointB = meshIsPointInsideRectangleService(
        pathsB, rectangles[length - 1]
    );

    if (!pointB) {
        return ;
    }

    rectangles.splice(-1, 0, [
        x, y, false,
        pointA[0], pointA[1], false,
        pointB[0], pointB[1], false,
        x, y, false
    ]);
};