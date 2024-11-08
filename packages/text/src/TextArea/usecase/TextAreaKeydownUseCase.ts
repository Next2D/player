
import { $getSelectedTextField } from "../../TextUtil";
import { execute as textFieldDeleteTextUseCase } from "../../TextField/usecase/TextFieldDeleteTextUseCase";
import { execute as textFieldInsertTextUseCase } from "../../TextField/usecase/TextFieldInsertTextUseCase";
import { execute as textFieldArrowUpUseCase } from "../../TextField/usecase/TextFieldArrowUpUseCase";
import { execute as textFieldArrowLeftUseCase } from "../../TextField/usecase/TextFieldArrowLeftUseCase";
import { execute as textFieldArrowRightUseCase } from "../../TextField/usecase/TextFieldArrowRightUseCase";
import { execute as textFieldArrowDownUseCase } from "../../TextField/usecase/TextFieldArrowDownUseCase";

/**
 * @description キーダウンイベントを処理します。
 *              Processes the keydown event.
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: KeyboardEvent): void =>
{
    const textField = $getSelectedTextField();
    if (!textField) {
        return ;
    }

    switch (event.key) {

        case "Backspace":
        case "Delete":
            textFieldDeleteTextUseCase(textField);
            break;

        case "Enter":
            textFieldInsertTextUseCase(textField, "\n");
            break;

        case "ArrowLeft":
            textFieldArrowLeftUseCase(textField);
            break;

        case "ArrowRight":
            textFieldArrowRightUseCase(textField);
            break;

        case "ArrowUp":
            textFieldArrowUpUseCase(textField);
            break;

        case "ArrowDown":
            textFieldArrowDownUseCase(textField);
            break;

        case "a":
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                textField.selectAll();
            }
            break;

        case "v":
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                textField.paste();
            }
            break;

        case "c":
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                textField.copy();
            }
            break;

        default:
            break;

    }
};