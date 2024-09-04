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
 * @description マイタージョインを追加
 *              Add a miter join
 * 
 * @param  {number} x 
 * @param  {number} y 
 * @param  {number} ax 
 * @param  {number} ay 
 * @param  {number} bx 
 * @param  {number} by 
 * @param  {number} index1 
 * @param  {number} index4 
 * @param  {number} index5 
 * @param  {number} index8 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x: number, y: number,
    ax: number, ay: number,
    bx: number, by: number,
    index1: number, index4: number,
    index5: number, index8: number
): void => {

    const index0: number = $getVertexBufferPosition() / 7;
    const index2: number = index0 + 1;
    const index3: number = index0 + 2;
    const index6: number = index0 + 3;
    const index7: number = index0 + 4;

    meahExpandIndexBufferIfNeededService(18);
    const ibd: Int16Array = $getIndexBufferData();
    let ibp: number = $getIndexBufferPosition();

    ibd[ibp++] = index0;
    ibd[ibp++] = index1;
    ibd[ibp++] = index2;

    ibd[ibp++] = index0;
    ibd[ibp++] = index2;
    ibd[ibp++] = index3;

    ibd[ibp++] = index0;
    ibd[ibp++] = index3;
    ibd[ibp++] = index4;

    ibd[ibp++] = index0;
    ibd[ibp++] = index5;
    ibd[ibp++] = index6;

    ibd[ibp++] = index0;
    ibd[ibp++] = index6;
    ibd[ibp++] = index7;

    ibd[ibp++] = index0;
    ibd[ibp++] = index7;
    ibd[ibp++] = index8;

    $setIndexBufferPosition(ibp);

    meshExpandVertexBufferIfNeededService(35);
    const vbd: Float32Array = $getVertexBufferData();
    let vbp: number = $getVertexBufferPosition();

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = ax;
    vbd[vbp++] = ay;
    vbd[vbp++] = bx;
    vbd[vbp++] = by;
    vbd[vbp++] = 0;

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = ax;
    vbd[vbp++] = ay;
    vbd[vbp++] = bx;
    vbd[vbp++] = by;
    vbd[vbp++] = 21;

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = ax;
    vbd[vbp++] = ay;
    vbd[vbp++] = bx;
    vbd[vbp++] = by;
    vbd[vbp++] = 22;

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = ax;
    vbd[vbp++] = ay;
    vbd[vbp++] = bx;
    vbd[vbp++] = by;
    vbd[vbp++] = 23;

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = ax;
    vbd[vbp++] = ay;
    vbd[vbp++] = bx;
    vbd[vbp++] = by;
    vbd[vbp++] = 24;

    $setVertexBufferPosition(vbp);
};