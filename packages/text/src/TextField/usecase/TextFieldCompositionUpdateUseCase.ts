import type { TextField } from "../../TextField";
import type { TextFormat } from "../../TextFormat";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldDeleteTextUseCase } from "../../TextField/usecase/TextFieldDeleteTextUseCase";

export const execute = (text_field: TextField, texts: string): void =>
{
    if (text_field.compositionEndIndex > -1) {
        const cacheIndex: number = text_field.compositionStartIndex;
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

    const length: number = texts.length;
    let newText: string  = "";
    if (!textData.textTable.length) {
        newText = texts;
        text_field.focusIndex = 1;
        text_field.compositionStartIndex = 1;
    } else {
        for (let idx: number = 1; idx < textData.textTable.length; ++idx) {

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
        if (text_field.compositionStartIndex === textData.textTable.length ) {
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
        text_field.text = newText;

        // reset
        text_field.$textFormats = null;

        textData = textFieldGetTextDataUseCase(text_field);
        let index = text_field.compositionStartIndex + length;
        for (let idx = text_field.compositionStartIndex; idx < index; ++idx) {

            const textObject = textData.textTable[idx];
            if (!textObject) {
                break;
            }

            textObject.textFormat.underline = true;
            if (textObject.mode === "wrap") {
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
        }

        text_field.compositionEndIndex = text_field.focusIndex = index;

        // move textarea element
        const player: Player = $currentPlayer();

        const lastIndex = Math.min(textData.textTable.length - 1, text_field.compositionEndIndex);
        const textObject = textData.textTable[lastIndex];
        if (textObject) {
            const line: number = textObject.line;

            let offsetHeight: number = 0;
            for (let idx = 0; idx < line; ++idx) {
                offsetHeight += textData.heightTable[idx];
            }

            const verticalAlign: number = textData.ascentTable[line];

            let offsetWidth: number = 0;
            let targetIndex: number = text_field.compositionEndIndex;
            for (;;) {

                const textObject = textData.textTable[targetIndex--];
                if (!textObject || textObject.line !== line) {
                    break;
                }

                offsetWidth += textObject.w;
            }

            const lineObject = textData.lineTable[line];
            const offsetAlign: number = text_field._$getAlignOffset(lineObject, text_field.width);

            const point = text_field.localToGlobal(new Point(
                offsetWidth + offsetAlign + player.tx,
                offsetHeight + verticalAlign + player.ty
            ));

            const div: HTMLElement | null = $document
                .getElementById(player.contentElementId);

            let left: number = point.x * player._$scale;
            let top: number  = point.y * player._$scale;
            if (div) {
                const rect: DOMRect = div.getBoundingClientRect();
                left += rect.left;
                top += rect.top;
            }

            $textArea.style.left = `${left}px`;
            $textArea.style.top  = `${top}px`;
        }
};