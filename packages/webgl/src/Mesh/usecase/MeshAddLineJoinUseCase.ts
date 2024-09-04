import { execute as meshCrossService } from "../service/MeshCrossService";
import { execute as meshAddBevelJoinUseCase } from "./MeshAddBevelJoinUseCase";
import { execute as meshAddRoundJoinUseCase } from "./MeshAddRoundJoinUseCase";
import { execute as meshAddMiterJoinUseCase } from "./MeshAddMiterJoinUseCase";
import { $context } from "../../WebGLUtil";

/**
 * @description ラインジョインを追加
 *              Add a line join
 * 
 * @param  {number} x1 
 * @param  {number} y1 
 * @param  {number} x2 
 * @param  {number} y2 
 * @param  {number} type 
 * @param  {number} x3 
 * @param  {number} y3 
 * @param  {number} index_offset2 
 * @param  {number} index_offset3 
 * @param  {number} index_offset4 
 * @param  {number} index_offset5 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x1: number, y1: number,
    x2: number, y2: number,
    type: number, 
    x3: number, y3: number,
    index_offset2: number,
    index_offset3: number,
    index_offset4: number = 0,
    index_offset5: number = 0
): void => {

    // AとBがほぼ平行なら、結合せずに終了
    const ax: number = x2 - x1;
    const ay: number = y2 - y1;
    const bx: number = x3 - x2;
    const by: number = y3 - y2;

    const det: number = meshCrossService(ax, ay, bx, by);
    if (Math.abs(det) < 0.0001) {
        return ;
    }

    // 分割したベジェ曲線はベベルで結合する
    if (type === 2) {
        meshAddBevelJoinUseCase(
            x2, y2,
            index_offset4, index_offset2, index_offset3, index_offset5
        );
        return;
    }

    // 結合タイプに合わせたメッシュを追加する
    switch ($context.joints) {

        case 2: // round
            meshAddRoundJoinUseCase(x2, y2);
            break;

        case 1: // miter 
            meshAddMiterJoinUseCase(
                x2, y2, x1, y1, x3, y3,
                index_offset4, index_offset2, index_offset3, index_offset5
            );
            break;

        default: // bevel
            meshAddBevelJoinUseCase(
                x2, y2,
                index_offset4, index_offset2, index_offset3, index_offset5
            );
            break;

    }
};