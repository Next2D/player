import type { TextField } from "../../TextField";
import { execute as textFormatGetWidthMarginService } from "../../TextFormat/service/TextFormatGetWidthMarginService";
import { execute as textFieldApplyChangesService } from "../../TextField/service/TextFieldApplyChangesService";

/**
 * @description 設定に合わせてテキストフィールドのサイズを変更します
 *              Resize the text field to fit your settings
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    // apply changes
    textFieldApplyChangesService(text_field);

    // update bounds
    if (text_field.autoSize === "none") {
        text_field.xMin = text_field.bounds.xMin;
        text_field.yMin = text_field.bounds.yMin;
        text_field.xMax = text_field.bounds.xMax;
        text_field.yMax = text_field.bounds.yMax;
        return ;
    }

    const textFormat = text_field.defaultTextFormat;

    // 4は左右の1pxのボーダーと1pxのマージンの合計値
    const width = text_field.textWidth + 4 + textFormatGetWidthMarginService(textFormat);
    if (text_field.wordWrap) {

        text_field.xMin = text_field.bounds.xMin;
        text_field.xMax = text_field.bounds.xMax;

    } else {

        switch (text_field.autoSize) {

            case "left":
                text_field.xMax = width + text_field.xMin;
                break;

            case "center":
                text_field.xMax = width + text_field.xMin;
                break;

            case "right":
                text_field.xMax = text_field.bounds.xMax
                    - (text_field.bounds.xMax - text_field.bounds.xMin
                        - (width - text_field.bounds.xMin));
                break;

            default:
                break;

        }

    }

    // 4は上下の1pxのボーダーと1pxのマージンの合計値
    text_field.yMax = text_field.textHeight + text_field.bounds.yMin + 4;
};