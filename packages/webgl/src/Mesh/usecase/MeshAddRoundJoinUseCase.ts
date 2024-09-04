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
 * @description ラウンドジョインを追加
 *              Add a round join
 * 
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number): void =>
{
    const index0: number = $getVertexBufferPosition() / 7;

    meahExpandIndexBufferIfNeededService(57);
    const ibd: Int16Array = $getIndexBufferData();
    let ibp: number = $getIndexBufferPosition();

    for (let idx = 1; idx < 18; idx++) {
        const indexN: number = index0 + idx;
        ibd[ibp++] = index0;
        ibd[ibp++] = indexN;
        ibd[ibp++] = indexN + 1;
    }

    ibd[ibp++] = index0;
    ibd[ibp++] = index0 + 18;
    ibd[ibp++] = index0 + 1;

    $setIndexBufferPosition(ibp);

    meshExpandVertexBufferIfNeededService(133);
    const vbd: Float32Array = $getVertexBufferData();
    let vbp: number = $getVertexBufferPosition();

    vbd[vbp++] = x;
    vbd[vbp++] = y;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;
    vbd[vbp++] = 0;

    for (let idx = 0; idx < 18; idx++) {
        vbd[vbp++] = x;
        vbd[vbp++] = y;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 0;
        vbd[vbp++] = 30 + idx;
    }

    $setVertexBufferPosition(vbp);
};