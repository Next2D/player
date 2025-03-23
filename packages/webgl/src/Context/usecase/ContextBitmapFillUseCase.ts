import { $getVertices } from "../../PathCommand";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";
import { $bitmapData } from "../../Bitmap";
import {
    $addFillBuffer,
    $fillTypes,
    $fillBufferIndexes
} from "../../Mesh";

/**
 * @description パスコマンドのビットマップ塗り実行します。
 *              Execute bitmap painting of path commands.
 *
 * @param  {Uint8Array} pixels
 * @param  {Float32Array} matrix
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} repeat
 * @param  {boolean} smooth
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    pixels: Uint8Array,
    matrix: Float32Array,
    width: number,
    height: number,
    repeat: boolean,
    smooth: boolean
): void => {

    const vertices = $getVertices();
    if (!vertices.length) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push("bitmap");

    const fillMesh = meshFillGenerateUseCase(vertices);
    $addFillBuffer(fillMesh.buffer);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(fillMesh.indexCount);

    $bitmapData.push(
        pixels, matrix, width, height, repeat, smooth
    );
};