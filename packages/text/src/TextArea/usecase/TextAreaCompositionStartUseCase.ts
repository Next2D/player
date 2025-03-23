import { $getSelectedTextField } from "../../TextUtil";
import { execute as textFieldCompositionStartService } from "../../TextField/service/TextFieldCompositionStartService";

/**
 * @description IME などのテキスト変換システムが新しい変換セッションを開始した時に発生します。
 *              Occurs when a text conversion system, such as an IME, starts a new conversion session.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const textField = $getSelectedTextField();
    if (!textField) {
        return ;
    }
    textFieldCompositionStartService(textField);
};