import { $getVertices } from "../../PathCommand";
import { execute as meshStrokeGenerateUseCase } from "../../Mesh/usecase/MeshStrokeGenerateUseCase";
import { $bitmapData } from "../../Bitmap";
import {
    $addFillBuffer,
    $fillTypes,
    $fillBufferIndexes
} from "../../Mesh";

/**
 * @description パスコマンドの線のビットマップの描画を実行します。
 *              Execute drawing of bitmap of line of path command.
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

    const vertices = $getVertices(true);
    if (!vertices.length) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push("bitmap");

    const mesh = meshStrokeGenerateUseCase(vertices);
    $addFillBuffer(mesh.buffer);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(mesh.indexCount);

    $bitmapData.push(
        pixels, matrix, width, height, repeat, smooth
    );
};