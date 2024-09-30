import { execute as meahExpandIndexBufferIfNeededService } from "../service/MeahExpandIndexBufferIfNeededService";
import { execute as meshExpandVertexBufferIfNeededService } from "../service/MeshExpandVertexBufferIfNeededService";
import {
    $getVertexBufferPosition,
    $setVertexBufferPosition,
    $getVertexBufferData,
    $getIndexBufferPosition,
    $setIndexBufferPosition,
    $getIndexBufferData
} from "../../Mesh";

/**
 * @description ベベルジョインを追加
 *              Add a bevel join
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} index1
 * @param  {number} index2
 * @param  {number} index3
 * @param  {number} index4
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x: number, y: number,
    index1: number, index2: number,
    index3: number, index4: number
): void => {

    const index0: number = $getVertexBufferPosition() / 7;

    meahExpandIndexBufferIfNeededService(6);
    const ibd: Int16Array = $getIndexBufferData();
    let ibp: number = $getIndexBufferPosition();

    ibd[ibp++] = index0;
    ibd[ibp++] = index1;
    ibd[ibp++] = index2;

    ibd[ibp++] = index0;
    ibd[ibp++] = index3;
    ibd[ibp++] = index4;

    $setIndexBufferPosition(ibp);

    meshExpandVertexBufferIfNeededService(7);
    const vbd: Float32Array = $getVertexBufferData();
    let vbp: number = $getVertexBufferPosition();

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;

    $setVertexBufferPosition(vbp);
};