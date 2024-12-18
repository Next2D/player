import type { IFillType } from "../../interface/IFillType";
import { $getVertices } from "../../PathCommand";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import {
    $addFillBuffer,
    $fillTypes,
    $fillBufferIndexes
} from "../../Mesh";

/**
 * @description Contextのパスコマンドの塗り実行します。
 *              Execute Context path command painting.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (type: IFillType): void =>
{
    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push(type);

    const fillMesh = meshFillGenerateUseCase(vertices);
    $addFillBuffer(fillMesh.buffer);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(fillMesh.indexCount);
};