import { $getSelectedTextField } from "../../TextUtil";
import { execute as textFieldCompositionEndUseCase } from "../../TextField/usecase/TextFieldCompositionEndUseCase";

/**
 * @description テキストフィールドのコンポジションエンドイベントを処理します。
 *              Processes the composition end event of the text field.
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
    textFieldCompositionEndUseCase(textField);
};