import { $getSelectedTextField } from "../../TextUtil";
import { Event } from "@next2d/events";
import { execute as textFieldInsertTextUseCase } from "../../TextField/usecase/TextFieldInsertTextUseCase";

/**
 * @description テキストエリアに入力された文字を挿入します。
 *              Inserts the characters entered in the text area.
 *
 * @param  {InputEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: InputEvent): void =>
{
    if (!event.data) {
        return ;
    }

    const textField = $getSelectedTextField();
    if (!textField) {
        return ;
    }
    textFieldInsertTextUseCase(textField, event.data);

    if (textField.hasEventListener(Event.INPUT)) {
        textField.dispatchEvent(new Event(Event.INPUT));
    }
};