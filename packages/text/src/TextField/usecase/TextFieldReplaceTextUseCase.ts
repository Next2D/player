import type { TextField } from "../../TextField";

/**
 * @description 指定した範囲の文字列を置き換える
 *              Replaces strings in the specified range
 *
 * @param  {TextField} text_filed 
 * @param  {string} new_text 
 * @param  {number} begin_index 
 * @param  {number} end_index 
 * @return {void} 
 * @method
 * @protected
 */
export const execute = (
    text_filed: TextField, 
    new_text: string,
    begin_index: number,
    end_index: number
): void => {

    if (0 > begin_index || begin_index > end_index) {
        return ;
    }

    const text = text_filed.text;

    const beginText = begin_index 
        ? text.slice(0, begin_index) 
        : "";

    text_filed.text = beginText 
        + new_text 
        + text.slice(end_index, text.length);
};