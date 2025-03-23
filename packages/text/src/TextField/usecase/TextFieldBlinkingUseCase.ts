import type { TextField } from "../../TextField";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";
import { execute as textAreaMovePositionService } from "../../TextArea/service/TextAreaMovePositionService";
import { $setBlinkingTimerId } from "../../TextUtil";

/**
 * @description テキストの点滅を実行します。
 *              Execute text blinking.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    // update
    text_field.focusVisible = !text_field.focusVisible;
    textFieldApplyChangesService(text_field);

    // next timer
    $setBlinkingTimerId(setTimeout(() => execute(text_field), 500));

    // TextArea move position
    textAreaMovePositionService(text_field);
};