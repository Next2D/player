import { $getVertices } from "../../PathCommand";
import { execute as meshStrokeGenerateUseCase } from "../../Mesh/usecase/MeshStrokeGenerateUseCase";
import {
    $addFillBuffer,
    $fillTypes,
    $fillBufferIndexes
} from "../../Mesh";

/**
 * @description ストロークを描画
 *              Draw a stroke
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const vertices = $getVertices(true);
    if (!vertices.length) {
        return ;
    }

    $fillTypes.push("fill");
    const mesh = meshStrokeGenerateUseCase(vertices);
    $addFillBuffer(mesh.buffer);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(mesh.indexCount);
};