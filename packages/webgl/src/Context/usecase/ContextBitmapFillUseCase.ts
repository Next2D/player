import { execute as meshFillCurrentPathUseCase } from "../../Mesh/usecase/MeshFillCurrentPathUseCase";
import { $bitmapData } from "../../Bitmap";
import {
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

    // いまの経路を塗りのメッシュにして、塗りのバッファへ追加する
    const indexCount = meshFillCurrentPathUseCase();
    if (indexCount < 0) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push("bitmap");

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(indexCount);

    $bitmapData.push(
        pixels, matrix, width, height, repeat, smooth
    );
};