import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";
import { execute as meshCalculateNormalVectorService } from "../service/MeshCalculateNormalVectorService";

/**
 * @description 直線の矩形を計算
 *              Calculate the rectangle of a line
 *
 * @param  {IPoint} start_point
 * @param  {IPoint} end_point
 * @param  {number} thickness
 * @return {IPath}
 * @method
 * @protected
 */
export const execute = (
    start_point: IPoint,
    end_point: IPoint,
    thickness: number
): IPath => {

    const vector: IPoint = {
        "x": end_point.x - start_point.x,
        "y": end_point.y - start_point.y
    };

    const normal = meshCalculateNormalVectorService(
        vector.x, vector.y, thickness
    );

    const shiftedUpStart: IPoint = {
        "x": start_point.x + normal.x,
        "y": start_point.y + normal.y
    };

    const shiftedUpEnd: IPoint = {
        "x": end_point.x + normal.x,
        "y": end_point.y + normal.y
    };

    const shiftedDownStart: IPoint = {
        "x": start_point.x - normal.x,
        "y": start_point.y - normal.y
    };

    const shiftedDownEnd: IPoint = {
        "x": end_point.x - normal.x,
        "y": end_point.y - normal.y
    };

    return [
        shiftedUpStart.x, shiftedUpStart.y, false,
        shiftedUpEnd.x, shiftedUpEnd.y, false,
        shiftedDownEnd.x, shiftedDownEnd.y, false,
        shiftedDownStart.x, shiftedDownStart.y, false,
        shiftedUpStart.x, shiftedUpStart.y, false
    ];
};