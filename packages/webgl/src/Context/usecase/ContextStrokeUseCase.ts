import { execute as meshStrokeCurrentPathUseCase } from "../../Mesh/usecase/MeshStrokeCurrentPathUseCase";
import {
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
    // いまの経路を線のメッシュにして、塗りのバッファへ追加する
    const indexCount = meshStrokeCurrentPathUseCase();
    if (indexCount < 0) {
        return ;
    }

    $fillTypes.push("fill");
    // 塗りのインデックスを追加
    $fillBufferIndexes.push(indexCount);
};