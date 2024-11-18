import type { DisplayObject } from "@next2d/display";
import type { TextField } from "@next2d/text";
import { $stage } from "@next2d/display";
import { PointerEvent } from "@next2d/events";
import {
    $setSelectedTextField,
    $getSelectedTextField,
    $textArea
} from "@next2d/text";
import {
    $hitObject,
    $hitMatrix
} from "../../CoreUtil";

/**
 * @description ポインターダウンイベントを処理します。
 *              Processes the pointer down event.
 *
 * @param  {number} page_x
 * @param  {number} page_y
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (
    page_x: number = 0,
    page_y: number = 0
): void => {

    const displayObject = $hitObject.hit as D;
    if (displayObject) {

        if (displayObject.isText) {

            // 選択中のTextFieldがある場合はフォーカスを解除します。
            const selectedTextField = $getSelectedTextField();
            if (selectedTextField
                && selectedTextField.instanceId !== displayObject.instanceId
            ) {
                selectedTextField.focus = false;
            }

            if (!(displayObject as unknown as TextField).focus) {
                (displayObject as unknown as TextField).focus = true;
                $setSelectedTextField(displayObject as unknown as TextField);
            }

            (displayObject as unknown as TextField).setFocusIndex(
                $hitObject.x - $hitMatrix[4],
                $hitObject.y - $hitMatrix[5]
            );

            $textArea.style.top  = `${page_x}px`;
            $textArea.style.left = `${page_y}px`;
        }

        // ヒットしたDisplayObjectポインターダウンイベントを発火します。
        if (displayObject.willTrigger(PointerEvent.POINTER_DOWN)) {
            displayObject.dispatchEvent(
                new PointerEvent(PointerEvent.POINTER_DOWN)
            );
        }

    } else {

        // 選択中のTextFieldがある場合はフォーカスを解除します。
        const selectedTextField = $getSelectedTextField();
        if (selectedTextField) {
            selectedTextField.focus = false;
            $setSelectedTextField(null);
        }

        // ステージ全体のポインターダウンイベントを発火します。
        if ($stage.willTrigger(PointerEvent.POINTER_DOWN)) {
            $stage.dispatchEvent(
                new PointerEvent(PointerEvent.POINTER_DOWN)
            );
        }
    }
};