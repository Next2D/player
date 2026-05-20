import type { TextField } from "../../TextField";
import { FocusEvent } from "@next2d/events";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";
import { execute as textFieldBlinkingClearTimeoutService } from "../service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "./TextFieldBlinkingUseCase";
import {
    $textArea,
    $getBlinkingTimerId,
    $getSelectedTextField,
    $setSelectedTextField
} from "../../TextUtil";

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

        $setSelectedTextField(text_field);

        setTimeout((): void =>
        {
            $textArea.focus();
        }, 300);

        if ($getBlinkingTimerId() === undefined) {
            if (text_field.focusIndex === -1) {
                text_field.focusIndex  = 1;
                text_field.selectIndex = -1;
            }
            textFieldBlinkingUseCase(text_field);
        }

    } else {

        if ($getSelectedTextField() === text_field) {
            $setSelectedTextField(null);
        }

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