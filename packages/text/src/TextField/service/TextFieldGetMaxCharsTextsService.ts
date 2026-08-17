import type { TextField } from "../../TextField";

/**
 * @description maxChars に設定された最大文字数を超えないように、入力テキストを切り詰めて返します。
 *              maxChars が 0 の場合は制限しません。
 *              Truncates the input text so that it does not exceed the maximum number of
 *              characters set in maxChars. If maxChars is 0, no restriction is applied.
 *
 * @param  {TextField} text_field
 * @param  {string} texts
 * @param  {number} current_length
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, texts: string, current_length: number): string =>
{
    if (!text_field.maxChars || !texts) {
        return texts;
    }

    const remaining = text_field.maxChars - current_length;
    if (remaining <= 0) {
        return "";
    }

    return remaining >= texts.length
        ? texts
        : texts.slice(0, remaining);
};
