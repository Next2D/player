import type { TextField } from "../../TextField";
import { FocusEvent } from "@next2d/events";
import { $textArea } from "../../TextUtil";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";
import { execute as textFieldBlinkingClearTimeoutService } from "../service/TextFieldBlinkingClearTimeoutService";

/**
 * @description フォーカス
 * 
 * @param  {TextField} text_field
 * @param  {string} name
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, name: string): void =>
{
    if (text_field.willTrigger(name)) {
        text_field.dispatchEvent(new FocusEvent(name));
    }

    $textArea.value = "";
    if (text_field.focus) {
        $textArea.focus();

        // todo set stage x,y

    } else {
        // params reset
        text_field.focusIndex   = -1;
        text_field.selectIndex  = -1;
        text_field.focusVisible = false;

        // clear blinking
        textFieldBlinkingClearTimeoutService();

        // blur event
        $textArea.blur();
    }

    textFieldApplyChangesService(text_field);
};