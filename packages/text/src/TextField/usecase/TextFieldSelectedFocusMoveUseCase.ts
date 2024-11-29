import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";

/**
 * @description テキストフィールドの選択中のテキスト位置にスクロールを移動します。
 *              Move the scroll to the selected text position in the text field.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    if (text_field.selectIndex === -1) {
        return ;
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    if (2 > textData.textTable.length) {
        return ;
    }

    const textObject = textData.textTable[text_field.selectIndex];
    if (!textObject) {
        return ;
    }

    const line = textObject.mode === "text"
        ? textObject.line
        : textObject.line - 1;

    const height = text_field.height;
    const scaleY = (text_field.textHeight - height) / height;

    let currentHeight = -text_field.scrollY * scaleY - 2;

    let endLine = 0;
    for (let idx = 0; idx < textData.heightTable.length; ++idx) {

        currentHeight += textData.heightTable[idx];
        if (currentHeight > height) {
            break;
        }

        endLine++;
    }

    currentHeight = -text_field.scrollY * scaleY - 2;
    let startLine = 0;
    for (let idx = 0; idx < textData.heightTable.length; ++idx) {

        currentHeight += textData.heightTable[idx];
        if (currentHeight > 0) {
            break;
        }

        startLine++;
    }

    if (startLine >= textObject.line) {
        if (text_field.xScrollShape.hasLocalVariable("job")) {
            text_field.xScrollShape.deleteLocalVariable("job");
        }

        text_field.scrollY -= textData.heightTable[textObject.line] / scaleY;
    }

    if (textObject.line >= endLine) {
        if (text_field.xScrollShape.hasLocalVariable("job")) {
            text_field.xScrollShape.deleteLocalVariable("job");
        }

        text_field.scrollY += textData.heightTable[textObject.line] / scaleY;
    }

    const width  = text_field.width;
    const scaleX = (text_field.textWidth - width) / width;

    let textWidth = 2;
    let limitWidth = text_field.scrollX * scaleX - 2 + width;
    for (let idx = 1; text_field.selectIndex >= idx; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject || textObject.line > line) {
            break;
        }

        if (textObject.line !== line) {
            continue;
        }

        if (text_field.selectIndex !== idx) {
            textWidth += textObject.w;
        }

        limitWidth -= textObject.w;
        if (limitWidth > 0) {
            continue;
        }

        if (text_field.yScrollShape.hasLocalVariable("job")) {
            text_field.yScrollShape.deleteLocalVariable("job");
        }
        text_field.scrollX += textObject.w / scaleX;

        break;
    }

    const scrollWidth = text_field.scrollX * scaleX - 2;
    if (scrollWidth > textWidth) {
        if (text_field.yScrollShape.hasLocalVariable("job")) {
            text_field.yScrollShape.deleteLocalVariable("job");
        }

        text_field.scrollX = text_field.width * ((textWidth - 2) / text_field.textWidth);

    }
};