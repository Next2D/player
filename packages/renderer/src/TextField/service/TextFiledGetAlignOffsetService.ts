import { ITextData } from "../../interface/ITextData";
import type { ITextObject } from "../../interface/ITextObject";
import type { ITextSetting } from "../../interface/ITextSetting";

/**
 * @description テキストの揃え位置のオフセット値を取得します。
 *              Get the offset value of the alignment position of the text.
 *
 * @param  {ITextData} text_data
 * @param  {ITextObject} text_object
 * @param  {ITextSetting} text_setting
 * @return {number}
 * @method
 * @protected
 */
export const execute = (
    text_data: ITextData,
    text_object: ITextObject,
    text_setting: ITextSetting
): number => {

    const lineWidth = text_data.widthTable[text_object.line] || 0;

    const textFormat = text_object.textFormat;
    const leftMargin = textFormat.leftMargin || 0;
    if (!text_setting.wordWrap && lineWidth > text_setting.width) {
        return Math.max(0, leftMargin);
    }

    const rightMargin = textFormat.rightMargin || 0;
    if (textFormat.align === "center" // format CENTER
        || text_setting.autoSize === "center" // autoSize CENTER
    ) {
        return Math.max(0, text_setting.width / 2 - leftMargin - rightMargin - lineWidth / 2 - 2);
    }

    if (textFormat.align === "right" // format RIGHT
        || text_setting.autoSize === "right" // autoSize RIGHT
    ) {
        return Math.max(0, text_setting.width - leftMargin - lineWidth - rightMargin - 4);
    }

    // autoSize LEFT
    // format LEFT
    return Math.max(0, leftMargin);
};