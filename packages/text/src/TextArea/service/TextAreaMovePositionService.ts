import type { TextField } from "../../TextField";
import { Point } from "@next2d/geom";
import { $stage } from "@next2d/display";
import {
    $textArea,
    $mainCanvasPosition
} from "../../TextUtil";

/**
 * @type {number}
 * @private
 */
const $devicePixelRatio: number = window.devicePixelRatio;

/**
 * @description フォーカスしているテキストの位置にテキストエリアを移動します。
 *              Move the text area to the position of the text that is focusing.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    const point = text_field.localToGlobal(new Point());

    const textData = text_field.$textData;
    if (textData) {

        const focusTextObject = textData.textTable[text_field.focusIndex];
        if (focusTextObject) {
            for (let idx = text_field.focusIndex - 1; idx > -1; --idx) {
                const textObject = textData.textTable[idx];
                if (!textObject || textObject.line !== focusTextObject.line) {
                    break;
                }
                point.x += textObject.w;
            }

            const line = focusTextObject.mode === "break"
                ? focusTextObject.line - 1
                : focusTextObject.line;

            for (let idx = 0; idx < line; ++idx) {
                point.y += textData.heightTable[idx];
            }
        }
    }

    const scale = $stage.rendererScale / $devicePixelRatio;
    $textArea.style.left = `${$mainCanvasPosition.x + point.x * scale}px`;
    $textArea.style.top  = `${$mainCanvasPosition.y + point.y * scale}px`;
};