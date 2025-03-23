import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingClearTimeoutService } from "../../TextField/service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "../../TextField/usecase/TextFieldBlinkingUseCase";

/**
 * @description テキストフィールドのフォーカスインデックスを下に移動します。
 *              Moves the focus index of the text field down.
 *
 * @param  {TextField} text_field
 * @param  {boolean} shift_key
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, shift_key: boolean): void =>
{
    if (text_field.focusIndex === -1) {
        return ;
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    if (2 > textData.textTable.length) {
        return ;
    }

    const textObject = textData.textTable[text_field.focusIndex];
    if (!textObject) {
        return ;
    }

    const line = textObject.mode === "text"
        ? textObject.line
        : textObject.line - 1;

    // 最終行の場合は、フォーカスインデックスを最終位置に設定
    if (line === textData.lineTable.length - 1) {
        if (!shift_key) {
            text_field.selectIndex = -1;
        } else {
            if (text_field.selectIndex === -1) {
                text_field.selectIndex = text_field.focusIndex;
            } else {
                if (text_field.selectIndex === text_field.focusIndex) {
                    text_field.selectIndex = -1;
                }
            }
        }

        text_field.focusVisible = false;
        text_field.focusIndex = textData.textTable.length;

        const width  = text_field.width;
        const scaleX = (text_field.textWidth - width) / width;

        let scrollX = 0;
        for (let idx = 1; text_field.focusIndex >= idx; ++idx) {

            const textObject = textData.textTable[idx];
            if (!textObject || textObject.line > line) {
                break;
            }

            if (textObject.line !== line) {
                continue;
            }

            scrollX += textObject.w;
        }

        if (text_field.yScrollShape.hasLocalVariable("job")) {
            text_field.yScrollShape.deleteLocalVariable("job");
        }
        text_field.scrollX = (scrollX - width) / scaleX;

        textFieldBlinkingClearTimeoutService();
        textFieldBlinkingUseCase(text_field);
        return ;
    }

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

    let currentWidth = 2;
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (text_field.focusIndex === idx) {
            if (textObject.mode === "text") {
                currentWidth +=  textObject.w / 2;
            }
            break;
        }

        if (textObject.line > line) {
            break;
        }

        if (textObject.line !== line || textObject.mode !== "text") {
            continue;
        }

        currentWidth += textObject.w;
    }

    let textWidth = 2;
    const targetLine = line + 1;
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (textObject.line > targetLine) {
            if (!shift_key) {
                text_field.selectIndex = -1;
            } else {
                if (text_field.selectIndex === -1) {
                    text_field.selectIndex = text_field.focusIndex;
                } else {
                    if (text_field.selectIndex === text_field.focusIndex) {
                        text_field.selectIndex = -1;
                    }
                }
            }

            if (textObject.line >= endLine) {
                if (text_field.xScrollShape.hasLocalVariable("job")) {
                    text_field.xScrollShape.deleteLocalVariable("job");
                }
                text_field.scrollY += textData.heightTable[textObject.line] / scaleY;
            }

            text_field.focusVisible = false;
            text_field.focusIndex = textObject.mode === "text" ? idx - 1 : idx;

            if (text_field.scrollX && textWidth < currentWidth) {
                if (text_field.yScrollShape.hasLocalVariable("job")) {
                    text_field.yScrollShape.deleteLocalVariable("job");
                }
                text_field.scrollX = text_field.width * ((textWidth - 2) / text_field.textWidth);
            }

            textFieldBlinkingClearTimeoutService();
            textFieldBlinkingUseCase(text_field);
            return ;
        }

        if (textObject.line !== targetLine || textObject.mode !== "text") {
            continue;
        }

        textWidth += textObject.w;
        if (textWidth > currentWidth) {

            if (!shift_key) {
                text_field.selectIndex = -1;
            } else {
                if (text_field.selectIndex === -1) {
                    text_field.selectIndex = text_field.focusIndex;
                } else {
                    if (text_field.selectIndex === idx - 1) {
                        text_field.selectIndex = -1;
                    }
                }
            }

            if (textObject.line >= endLine) {
                if (text_field.xScrollShape.hasLocalVariable("job")) {
                    text_field.xScrollShape.deleteLocalVariable("job");
                }
                text_field.scrollY += textData.heightTable[textObject.line] / scaleY;
            }

            if (text_field.scrollX) {
                const width = text_field.width;
                const scaleX = (text_field.textWidth - width) / width;
                const scrollWidth = text_field.scrollX * scaleX - 2;
                if (scrollWidth > textWidth) {
                    if (text_field.yScrollShape.hasLocalVariable("job")) {
                        text_field.yScrollShape.deleteLocalVariable("job");
                    }
                    text_field.scrollX = text_field.width * ((textWidth - 2) / text_field.textWidth);
                }
            }

            text_field.focusVisible = false;
            text_field.focusIndex = idx;
            textFieldBlinkingClearTimeoutService();
            textFieldBlinkingUseCase(text_field);
            return ;
        }
    }

    if (!shift_key) {
        text_field.selectIndex = -1;
    } else {
        if (text_field.selectIndex === -1) {
            text_field.selectIndex = text_field.focusIndex;
        }
    }

    text_field.focusVisible = false;
    text_field.focusIndex = textData.textTable.length;
    textFieldBlinkingClearTimeoutService();
    textFieldBlinkingUseCase(text_field);
};