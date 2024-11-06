import type { TextData } from "../../TextData";
import type { TextFormat } from "../../TextFormat";
import type { ITextObject } from "../../interface/ITextObject";
import { execute as textFormatGenerateFontStyleService } from "../../TextFormat/service/TextFormatGenerateFontStyleService";
import {
    $context,
    $setCurrentWidth
} from "../../TextUtil";

/**
 * @description 新しい行を作成
 *              Create a new line
 * 
 * @param {TextData} text_data
 * @param {TextFormat} text_format
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    text_data: TextData,
    text_format: TextFormat
): void => {

    $setCurrentWidth(0);

    const line = text_data.lineTable.length;

    $context.font = textFormatGenerateFontStyleService(text_format);
    const mesure: TextMetrics = $context.measureText("");

    const object: ITextObject = {
        "mode": "break",
        "text": "",
        "x": 0,
        "y": 0,
        "w": 0,
        "h": mesure.fontBoundingBoxAscent + mesure.fontBoundingBoxDescent,
        "line": line,
        "textFormat": text_format.toObject()
    };

    // initialize
    text_data.heightTable[line] = 0;
    text_data.ascentTable[line] = 0;
    text_data.widthTable[line]  = 0;

    // register
    text_data.lineTable.push(object);
    text_data.textTable.push(object);
};