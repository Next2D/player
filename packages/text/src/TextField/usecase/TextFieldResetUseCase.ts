import type { TextField } from "../../TextField";
import { $cacheStore } from "@next2d/cache";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";

/**
 * @description 指定したテキストフィールドのテキストデータをリセットします。
 *              Resets the text data in the specified text field.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    text_field.$textData = null;

    textFieldApplyChangesService(text_field);

    // Remove cache
    // Main 側のみ wipe する。Worker 側は次回 MISS 描画時に
    // 旧 Node を解放してから新 Node を確保するため、ここで $removeIds.push しない。
    // push してしまうと、Worker が同フレームで作成した新キャッシュを次フレーム冒頭で
    // wipe → その次のフレームで Main HIT → Worker null → 永続無描画 になる。
    if (text_field.uniqueKey !== "" && $cacheStore.has(text_field.uniqueKey)) {
        $cacheStore.removeById(text_field.uniqueKey);
    }
};