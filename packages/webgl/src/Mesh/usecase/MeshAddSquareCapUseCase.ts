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
 * @description スクエアキャップを追加
 *              Add a square cap
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

    const index3: number = $getVertexBufferPosition() / 7;
    const index4: number = index3 + 1;

    meahExpandIndexBufferIfNeededService(6);
    const ibd: Int16Array = $getIndexBufferData();
    let ibp: number = $getIndexBufferPosition();

    ibd[ibp++] = index1;
    ibd[ibp++] = index3;
    ibd[ibp++] = index4;

    ibd[ibp++] = index4;
    ibd[ibp++] = index2;
    ibd[ibp++] = index1;

    $setIndexBufferPosition(ibp);

    meshExpandVertexBufferIfNeededService(14);
    const vbd: Float32Array = $getVertexBufferData();
    let vbp: number = $getVertexBufferPosition();

    vbd[vbp++] = x1;
    vbd[vbp++] = y1;
    vbd[vbp++] = x2;
    vbd[vbp++] = y2;
    vbd[vbp++] = -1;
    vbd[vbp++] = -1;
    vbd[vbp++] = 10;

    vbd[vbp++] = x1;
    vbd[vbp++] = y1;
    vbd[vbp++] = x2;
    vbd[vbp++] = y2;
    vbd[vbp++] = 1;
    vbd[vbp++] = 1;
    vbd[vbp++] = 10;

    $setVertexBufferPosition(vbp);
};