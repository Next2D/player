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
    if (text_field.uniqueKey !== "" && $cacheStore.has(text_field.uniqueKey)) {
        $cacheStore.removeById(text_field.uniqueKey);
        $cacheStore.$removeIds.push(+text_field.uniqueKey);
    }
};