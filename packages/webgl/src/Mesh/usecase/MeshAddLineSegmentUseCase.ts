import { execute as meshExpandVertexBufferIfNeededService } from "../service/MeshExpandVertexBufferIfNeededService";
import { execute as meahExpandIndexBufferIfNeededService } from "../service/MeahExpandIndexBufferIfNeededService";
import {
    $getVertexBufferPosition,
    $setVertexBufferPosition,
    $getVertexBufferData,
    $getIndexBufferPosition,
    $setIndexBufferPosition,
    $getIndexBufferData
} from "../../Mesh";

/**
 * @description ラインセグメントを追加
 *              Add a line segment
 *
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @param  {number} type
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    x1: number, y1: number,
    x2: number, y2: number,
    type: number = 1
): void => {

    const index0: number = $getVertexBufferPosition() / 7;
    const index1: number = index0 + 1;
    const index2: number = index0 + 2;
    const index3: number = index0 + 3;

    meahExpandIndexBufferIfNeededService(6);
    const ibd: Int16Array = $getIndexBufferData();
    let ibp: number = $getIndexBufferPosition();

    ibd[ibp++] = index0;
    ibd[ibp++] = index1;
    ibd[ibp++] = index3;

    ibd[ibp++] = index3;
    ibd[ibp++] = index2;
    ibd[ibp++] = index0;

    $setIndexBufferPosition(ibp);

    meshExpandVertexBufferIfNeededService(28);
    const vbd = $getVertexBufferData();

    let vbp = $getVertexBufferPosition();

    vbd[vbp++] = x1;
    vbd[vbp++] = y1;
    vbd[vbp++] = x2;
    vbd[vbp++] = y2;
    vbd[vbp++] = 1;
    vbd[vbp++] = 1;
    vbd[vbp++] = 1;

    vbd[vbp++] = x1;
    vbd[vbp++] = y1;
    vbd[vbp++] = x2;
    vbd[vbp++] = y2;
    vbd[vbp++] = -1;
    vbd[vbp++] = -1;
    vbd[vbp++] = 1;

    vbd[vbp++] = x2;
    vbd[vbp++] = y2;
    vbd[vbp++] = x1;
    vbd[vbp++] = y1;
    vbd[vbp++] = -1;
    vbd[vbp++] = -1;
    vbd[vbp++] = type;

    vbd[vbp++] = x2;
    vbd[vbp++] = y2;
    vbd[vbp++] = x1;
    vbd[vbp++] = y1;
    vbd[vbp++] = 1;
    vbd[vbp++] = 1;
    vbd[vbp++] = type;

    $setVertexBufferPosition(vbp);
};