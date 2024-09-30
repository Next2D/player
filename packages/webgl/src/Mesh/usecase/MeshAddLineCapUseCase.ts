import { $context } from "../../WebGLUtil";
import { execute as meshAddRoundJoinUseCase } from "./MeshAddRoundJoinUseCase";
import { execute as meshAddSquareCapUseCase } from "./MeshAddSquareCapUseCase";

/**
 * @description ラインキャップを追加
 *              Add a line cap
 *
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @param  {number} index1
 * @param  {number} index2
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x1: number, y1: number,
    x2: number, y2: number,
    index1: number, index2: number
): void => {

    // 線端タイプに合わせたメッシュを追加する
    switch ($context.caps) {

        case 1: // round
            meshAddRoundJoinUseCase(x1, y1);
            break;

        case 2: // square
            meshAddSquareCapUseCase(x1, y1, x2, y2, index1, index2);
            break;

        default: // none
            break;

    }
};