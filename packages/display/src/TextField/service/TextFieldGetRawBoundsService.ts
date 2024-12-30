import type { TextField } from "@next2d/text";
import { $getBoundsArray } from "../../DisplayObjectUtil";

/**
 * @description TextFieldのローカルバウンディングボックスを取得します。
 *              Get the local bounding box of the TextField.
 *
 * @param  {TextField} text_field
 * @return {Float32Array}
 * @protected
 */
export const execute = (text_field: TextField): Float32Array =>
{
    return $getBoundsArray(
        text_field.xMin,
        text_field.yMin,
        text_field.xMax,
        text_field.yMax
    );
};