import type { IFillType } from "../../interface/IFillType";
import { execute as meshFillCurrentPathUseCase } from "../../Mesh/usecase/MeshFillCurrentPathUseCase";
import {
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
    // いまの経路を塗りのメッシュにして、塗りのバッファへ追加する
    const indexCount = meshFillCurrentPathUseCase();
    if (indexCount < 0) {
        return ;
    }

    // 塗りの種類を追加
    $fillTypes.push(type);

    // 塗りのインデックスを追加
    $fillBufferIndexes.push(indexCount);
};