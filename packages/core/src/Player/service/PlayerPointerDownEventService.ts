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
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (): void =>
{
    const displayObject = $hitObject.hit as unknown as D;

    // 選択中のTextFieldがある場合はフォーカスを解除します。
    const selectedTextField = $getSelectedTextField();
    if (selectedTextField) {
        if (!displayObject || selectedTextField.instanceId !== displayObject.instanceId) {
            selectedTextField.focus = false;
            $setSelectedTextField(null);
        }
    }

    if (displayObject) {

        if (displayObject.isText) {

            if (!(displayObject as unknown as TextField).focus) {
                (displayObject as unknown as TextField).focus = true;
                $setSelectedTextField(displayObject as unknown as TextField);
            } else {
                setTimeout((): void =>
                {
                    $textArea.focus();
                }, 300);
            }

            (displayObject as unknown as TextField).setFocusIndex(
                $hitObject.x - $hitMatrix[4],
                $hitObject.y - $hitMatrix[5]
            );
        }

        // ヒットしたDisplayObjectポインターダウンイベントを発火します。
        if (displayObject.willTrigger(PointerEvent.POINTER_DOWN)) {
            displayObject.dispatchEvent(
                new PointerEvent(PointerEvent.POINTER_DOWN)
            );
        }

    } else {
        // ステージ全体のポインターダウンイベントを発火します。
        if ($stage.willTrigger(PointerEvent.POINTER_DOWN)) {
            $stage.dispatchEvent(
                new PointerEvent(PointerEvent.POINTER_DOWN)
            );
        }
    }
};