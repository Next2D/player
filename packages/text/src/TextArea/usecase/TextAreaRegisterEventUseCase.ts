import { execute as textAreaCompositionStartUseCase } from "./TextAreaCompositionStartUseCase";
import { execute as textAreaCompositionUpdateUseCase } from "./TextAreaCompositionUpdateUseCase";

/**
 * @description テキストエリアにイベントを登録します。
 *              Registers events in the text area.
 * 
 * @param  {HTMLTextAreaElement} text_area
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_area: HTMLTextAreaElement): void =>
{
    text_area.addEventListener("compositionstart", textAreaCompositionStartUseCase);
    text_area.addEventListener("compositionupdate", textAreaCompositionUpdateUseCase);
};