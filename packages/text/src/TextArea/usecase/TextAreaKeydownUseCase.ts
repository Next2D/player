
import { $getSelectedTextField } from "../../TextUtil";
import { execute as textFieldDeleteTextUseCase } from "../../TextField/usecase/TextFieldDeleteTextUseCase";
import { execute as textFieldInsertTextUseCase } from "../../TextField/usecase/TextFieldInsertTextUseCase";
import { execute as textFieldArrowUpUseCase } from "../../TextField/usecase/TextFieldArrowUpUseCase";

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
            break;

        case "ArrowRight":
            break;

        case "ArrowUp":
            textFieldArrowUpUseCase(textField);
            break;

        case "ArrowDown":
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