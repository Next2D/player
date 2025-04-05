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
    // composition evnet
    text_area.addEventListener("compositionstart", textAreaCompositionStartUseCase as EventListener);
    text_area.addEventListener("compositionupdate", textAreaCompositionUpdateUseCase as EventListener);
    text_area.addEventListener("compositionend", textAreaCompositionEndUseCase as EventListener);

    // input event
    text_area.addEventListener("input", textAreaInputUseCase as EventListener);
};