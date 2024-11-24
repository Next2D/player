import type { DisplayObject } from "@next2d/display";
import type { TextField } from "@next2d/text";
import { $stage } from "@next2d/display";
import { $hitObject } from "../../CoreUtil";
import {
    $setEvent,
    WheelEvent as Next2D_WheelEvent
} from "@next2d/events";

/**
 * @description ホイールイベントを実行します。
 *              Executes the wheel event.
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject>(event: WheelEvent): void =>
{
    $setEvent(event);

    const displayObject = $hitObject.hit as unknown as D;
    if (displayObject && displayObject.isText
        && (displayObject as unknown as TextField).scrollEnabled
    ) {

        event.preventDefault();

        if (event.deltaX) {
            (displayObject as unknown as TextField).scrollX += event.deltaX / ((displayObject as unknown as TextField).textWidth / (displayObject as unknown as TextField).width);
        }

        if (event.deltaY) {
            (displayObject as unknown as TextField).scrollY += event.deltaY / ((displayObject as unknown as TextField).textHeight / (displayObject as unknown as TextField).height);
        }

        return ;
    }

    if ($stage.willTrigger(Next2D_WheelEvent.WHEEL)) {
        // イベントの伝播を止める
        event.preventDefault();

        $stage.dispatchEvent(new Next2D_WheelEvent(
            Next2D_WheelEvent.WHEEL
        ));
    }
};