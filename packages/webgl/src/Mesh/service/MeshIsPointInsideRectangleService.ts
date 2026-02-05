import type { IPath } from "../../interface/IPath";

/**
 * @description Canvas 2Dコンテキスト（点が矩形内にあるか判定用）
 */
const $canvas = new OffscreenCanvas(1, 1);
const $canvasContext = $canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

/**
 * @description 矩形内に含まれてない座標を返却
 *              Returns coordinates that are not included in the rectangle
 *
 * @param  {number[]} points
 * @param  {IPath} rectangle
 * @return {number[] | null}
 * @method
 * @protected
 */
export const execute = (
    points: number[],
    rectangle: IPath
): number[] | null => {

    $canvasContext.beginPath();
    $canvasContext.moveTo(
        rectangle[0] as number,
        rectangle[1] as number
    );

    for (let idx = 3; idx < rectangle.length; idx += 3) {
        if (rectangle[idx + 2] as boolean) {
            $canvasContext.quadraticCurveTo(
                rectangle[idx] as number,
                rectangle[idx + 1] as number,
                rectangle[idx + 3] as number,
                rectangle[idx + 4] as number
            );
            idx += 3;
        } else {
            $canvasContext.lineTo(
                rectangle[idx] as number,
                rectangle[idx + 1] as number
            );
        }
    }

    $canvasContext.closePath();

    for (let idx = 0; idx < points.length; idx += 2) {
        const px = points[idx];
        const py = points[idx + 1];

        if ($canvasContext.isPointInPath(px, py)) {
            continue;
        }

        return [px, py];
    }

    return null;
};
