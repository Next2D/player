import { $getSelectedTextField } from "../../TextUtil";
import { execute as textFieldCompositionUpdateUseCase } from "../../TextField/usecase/TextFieldCompositionUpdateUseCase";

/**
 * @description IME などのテキスト変換システムによって制御されているテキスト変換セッションに新しい文字が入力されたときに発生します。
 *              Occurs when a new character is entered into a text conversion session controlled by a text conversion system such as an IME.
 *
 * @param  {CompositionEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: CompositionEvent): void =>
{
    const textField = $getSelectedTextField();
    if (!textField) {
        return ;
    }
    textFieldCompositionUpdateUseCase(textField, event.data);
};