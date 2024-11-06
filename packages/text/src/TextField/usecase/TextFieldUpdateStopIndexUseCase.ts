import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";

/**
 * @description テキストの任意の表示終了位置の設定
 *              Setting an arbitrary display end position for text.
 *
 * @param  {TextField} text_field
 * @param  {number} stop_index
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, stop_index: number): void =>
{
    const textData = textFieldGetTextDataUseCase(text_field);
    if (2 > textData.textTable.length) {
        return ;
    }

    let currentTextWidth = 2;
    let targetIndex = 0;
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        let countUp = false;
        if (textObject.mode === "text") {
            countUp = true;
            currentTextWidth += textObject.w;
        }

        if (targetIndex >= stop_index) {
            targetIndex = idx;
            break;
        }

        if (textObject.mode === "break") {
            countUp = true;
            currentTextWidth = 2;
        }

        if (countUp) {
            targetIndex++;
        }

    }

    const textObject = textData.textTable[targetIndex];
    if (!textObject) {
        return ;
    }

    text_field.$scrollX = text_field.$scrollY = 0;

    const line = textObject.line;

    let currentTextHeight = 0;
    for (let idx = 0; idx <= line; ++idx) {
        currentTextHeight += textData.heightTable[idx];
    }

    const height = text_field.height;
    let viewTextHeight = 0;
    for (let idx = line; idx > -1; --idx) {
        const lineHeight = textData.heightTable[idx];
        if (height < viewTextHeight + lineHeight) {
            break;
        }
        viewTextHeight += lineHeight;
    }

    if (currentTextHeight > height) {
        const scaleY = (text_field.textHeight - height) / height;
        text_field.$scrollY = Math.min((currentTextHeight - viewTextHeight) / scaleY, height);
    }

    const width = text_field.width;
    let viewTextWidth = 0;
    for (let idx = targetIndex; idx > 0; --idx) {
        const textObject = textData.textTable[idx];
        if (textObject.mode !== "text") {
            continue;
        }

        if (width < viewTextWidth + textObject.w) {
            break;
        }
        viewTextWidth += textObject.w;
    }

    if (currentTextWidth > width) {
        const scaleX = (text_field.textWidth - width) / width;
        text_field.$scrollX = Math.min((currentTextWidth - viewTextWidth) / scaleX, width + 0.5);
    }

    textFieldApplyChangesService(text_field);
};