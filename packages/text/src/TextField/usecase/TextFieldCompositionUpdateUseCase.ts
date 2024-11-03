import type { TextField } from "../../TextField";
import type { TextFormat } from "../../TextFormat";
import { Point } from "@next2d/geom";
import { $textArea } from "../../TextUtil";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldDeleteTextUseCase } from "../../TextField/usecase/TextFieldDeleteTextUseCase";

/**
 * @description 新しい文字が入力されたときのイベント処理関数
 *              Event processing function when a new character is entered
 * 
 * @param  {TextField} text_field 
 * @param  {string} texts 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, texts: string): void =>
{
    if (text_field.compositionEndIndex > -1) {
        const cacheIndex = text_field.compositionStartIndex;
        text_field.focusIndex  = text_field.compositionStartIndex;
        text_field.selectIndex = text_field.compositionEndIndex - 1;

        text_field.compositionStartIndex = -1;
        textFieldDeleteTextUseCase(text_field);

        // reset
        text_field.compositionStartIndex = cacheIndex;
        text_field.selectIndex = -1;
    }

    let textData = textFieldGetTextDataUseCase(text_field);
    const textFormats: TextFormat[] = [];

    const length = texts.length;
    let newText  = "";
    if (2 > textData.textTable.length) {
        newText = texts;
        text_field.focusIndex = 1;
        text_field.compositionStartIndex = 1;
    } else {

        for (let idx = 1; idx < textData.textTable.length; ++idx) {

            const textObject = textData.textTable[idx];
            if (!textObject) {
                continue;
            }

            if (text_field.compositionStartIndex === idx) {
                for (let idx: number = 0; idx < length; ++idx) {
                    textFormats.push(textObject.textFormat.clone());
                    newText += texts[idx];
                }
            }

            switch (textObject.mode) {

                case "break":
                    textFormats.push(textObject.textFormat);
                    newText += "\n";
                    break;

                case "text":
                    textFormats.push(textObject.textFormat);
                    newText += textObject.text;
                    break;

                default:
                    continue;

            }
        }

        // last text
        if (text_field.compositionStartIndex === textData.textTable.length) {

            const textObject = textData.textTable[text_field.compositionStartIndex - 1];
            if (!textObject) {
                return ;
            }

            for (let idx = 0; idx < length; ++idx) {
                textFormats.push(textObject.textFormat.clone());
                newText += texts[idx];
            }
        }
    }

    // update
    if (textFormats.length) {
        text_field.$textFormats = textFormats;
    }

    // fixed logic
    text_field.text = newText;

    // fixed logic
    text_field.$textFormats = null;

    textData = textFieldGetTextDataUseCase(text_field);
    let index = text_field.compositionStartIndex + length;
    for (let idx = text_field.compositionStartIndex; idx < index; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            break;
        }

        textObject.textFormat.underline = true;
        if (textObject.mode !== "wrap") {
            continue;
        }

        if (idx === text_field.compositionStartIndex) {
            
            let subIndex = 1;
            for (;;) {
                const textObject = textData.textTable[idx - subIndex];
                if (!textObject) {
                    break;
                }

                if (textObject.mode === "text") {
                    textObject.textFormat.underline = true;
                    break;
                }

                subIndex++;
            }
        }

        if (idx > text_field.compositionStartIndex) {
            index++;
        }
    }

    text_field.compositionEndIndex = text_field.focusIndex = index;

    const lastIndex = Math.min(textData.textTable.length - 1, index);
    const textObject = textData.textTable[lastIndex];
    if (!textObject) {
        return ;
    }

    const line = textObject.line;

    let offsetHeight = 0;
    for (let idx = 0; idx < line; ++idx) {
        offsetHeight += textData.heightTable[idx];
    }

    const verticalAlign = textData.ascentTable[line];

    let offsetWidth = 0;
    let targetIndex = text_field.compositionEndIndex;
    for (;;) {

        const textObject = textData.textTable[targetIndex--];
        if (!textObject || textObject.line !== line) {
            break;
        }

        offsetWidth += textObject.w;
    }

    const lineObject  = textData.lineTable[line];
    const offsetAlign = text_field._$getAlignOffset(lineObject, text_field.width);

    // const point = text_field.localToGlobal(new Point(
    //     offsetWidth  + offsetAlign   + player.tx,
    //     offsetHeight + verticalAlign + player.ty
    // ));

    // const div: HTMLElement | null = document
    //     .getElementById(player.contentElementId);

    // let left = point.x * player._$scale;
    // let top  = point.y * player._$scale;
    // if (div) {
    //     const rect = div.getBoundingClientRect();
    //     left += rect.left;
    //     top  += rect.top;
    // }

    // $textArea.style.left = `${left}px`;
    // $textArea.style.top  = `${top}px`;
};