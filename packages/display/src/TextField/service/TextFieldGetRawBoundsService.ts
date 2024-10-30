import type { TextField } from "@next2d/text";
import { $getArray } from "../../DisplayObjectUtil";

/**
 * @description TextFieldのローカルバウンディングボックスを取得します。
 *              Get the local bounding box of the TextField.
 * 
 * @param  {TextField} text_field 
 * @return {number[]}
 * @protected
 */
export const execute = (text_field: TextField): number[] =>
{
    return $getArray(
        text_field.xMin,
        text_field.yMin,
        text_field.xMax,
        text_field.yMax
    );
};