import type { TextField } from "../../TextField";
import { execute as textFieldArrowDownUseCase } from "../../TextField/usecase/TextFieldArrowDownUseCase";
import { execute as textFieldArrowUpUseCase } from "../../TextField/usecase/TextFieldArrowUpUseCase";
import { execute as textFieldArrowLeftUseCase } from "../../TextField/usecase/TextFieldArrowLeftUseCase";
import { execute as textFieldArrowRightUseCase } from "../../TextField/usecase/TextFieldArrowRightUseCase";

/**
 * @description テキストフィールドのキーボードダウンイベントを実行する
 *              Execute the keyboard down event of the text field
 *
 * @param  {TextField} text_field
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, event: KeyboardEvent): void =>
{
    if (text_field.focusIndex === -1) {
        return ;
    }

    switch (event.key) {

        case "Backspace":
        case "Delete":
            text_field.deleteText();
            break;

        case "Enter":
            text_field.insertText("\n");
            break;

        case "ArrowLeft":
            textFieldArrowLeftUseCase(text_field, event.shiftKey);
            break;

        case "ArrowRight":
            textFieldArrowRightUseCase(text_field, event.shiftKey);
            break;

        case "ArrowUp":
            textFieldArrowUpUseCase(text_field, event.shiftKey);
            break;

        case "ArrowDown":
            textFieldArrowDownUseCase(text_field, event.shiftKey);
            break;

        case "a":
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                text_field.selectAll();
            }
            break;

        case "c":
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                text_field.copy();
            }
            break;

        case "v":
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                text_field.paste();
            }
            break;

        default:
            break;

    }
};