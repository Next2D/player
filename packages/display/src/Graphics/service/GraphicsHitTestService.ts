import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import { Graphics } from "../../Graphics";

/**
 * @description 指定のパスが描画のヒット範囲か判定
 *              Determines if the specified path is within the hit range for drawing
 *
 * @param  {CanvasRenderingContext2D} context
 * @param  {array} recodes
 * @param  {IPlayerHitObject} hit_object
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = (
    context: CanvasRenderingContext2D,
    recodes: any[],
    hit_object: IPlayerHitObject
): boolean => {

    for (let idx = 0; idx < recodes.length; ) {

        switch (recodes[idx++]) {

            case Graphics.BEGIN_PATH:
                context.beginPath();
                break;

            case Graphics.MOVE_TO:
                context.moveTo(recodes[idx++], recodes[idx++]);
                break;

            case Graphics.LINE_TO:
                context.lineTo(recodes[idx++], recodes[idx++]);
                break;

            case Graphics.CURVE_TO:
                context.quadraticCurveTo(
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++]
                );
                break;

            case Graphics.FILL_STYLE:
                idx += 4;
                continue;

            case Graphics.END_FILL:
                if (context.isPointInPath(hit_object.x, hit_object.y)) {
                    return true;
                }
                break;

            case Graphics.STROKE_STYLE:
                idx += 8;
                continue;

            case Graphics.END_STROKE:
                if (context.isPointInStroke(hit_object.x, hit_object.y)) {
                    return true;
                }
                break;

            case Graphics.CLOSE_PATH:
                context.closePath();
                break;

            case Graphics.CUBIC:
                context.bezierCurveTo(
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++],
                    recodes[idx++], recodes[idx++]
                );
                break;

            case Graphics.ARC:
                context.arc(
                    recodes[idx++], recodes[idx++], recodes[idx++],
                    0, 2 * Math.PI
                );
                break;

            case Graphics.GRADIENT_FILL:
                if (context.isPointInPath(hit_object.x, hit_object.y)) {
                    return true;
                }
                idx += 6;
                continue;

            case Graphics.GRADIENT_STROKE:
                if (context.isPointInStroke(hit_object.x, hit_object.y)) {
                    return true;
                }
                idx += 12;
                continue;

            case Graphics.BITMAP_FILL:
                if (context.isPointInPath(hit_object.x, hit_object.y)) {
                    return true;
                }
                idx += 6;
                continue;

            case Graphics.BITMAP_STROKE:
                if (context.isPointInStroke(hit_object.x, hit_object.y)) {
                    return true;
                }
                idx += 9;
                continue;

            default:
                break;

        }
    }

    return false;
};