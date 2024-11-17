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
 * @param  {D | null} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (
    display_object: D | null = null,
    page_x: number = 0,
    page_y: number = 0
): void => {

    if (display_object) {

        if (display_object.isText) {

            // 選択中のTextFieldがある場合はフォーカスを解除します。
            const selectedTextField = $getSelectedTextField();
            if (selectedTextField
                && selectedTextField.instanceId !== display_object.instanceId
            ) {
                selectedTextField.focus = false;
            }

            if (!(display_object as unknown as TextField).focus) {
                (display_object as unknown as TextField).focus = true;
                $setSelectedTextField(display_object as unknown as TextField);
            }

            (display_object as unknown as TextField).setFocusIndex(
                $hitObject.x - $hitMatrix[4],
                $hitObject.y - $hitMatrix[5]
            );

            $textArea.style.top  = `${page_x}px`;
            $textArea.style.left = `${page_y}px`;

        } else {
            // ヒットしたDisplayObjectポインターダウンイベントを発火します。
            if (display_object.willTrigger(PointerEvent.POINTER_DOWN)) {
                display_object.dispatchEvent(
                    new PointerEvent(PointerEvent.POINTER_DOWN)
                );
            }
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