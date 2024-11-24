import { execute as textAreaCompositionStartUseCase } from "./TextAreaCompositionStartUseCase";
import { execute as textAreaCompositionUpdateUseCase } from "./TextAreaCompositionUpdateUseCase";
import { execute as textAreaCompositionEndUseCase } from "./TextAreaCompositionEndUseCase";
import { execute as textAreaInputUseCase } from "./TextAreaInputUseCase";

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
    // omposition evnet
    text_area.addEventListener("compositionstart", textAreaCompositionStartUseCase);
    text_area.addEventListener("compositionupdate", textAreaCompositionUpdateUseCase);
    text_area.addEventListener("compositionend", textAreaCompositionEndUseCase);

    // input event
    text_area.addEventListener("input", textAreaInputUseCase);
};