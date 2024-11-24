import type { TextField } from "../../TextField";
import type { Shape } from "@next2d/display";
import { Event } from "@next2d/events";
import { Tween, Easing, type Job } from "@next2d/ui";
import { $clamp } from "../../TextUtil";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";

/**
 * @description xスクロール位置を設定します
 *              x Sets the scroll position.
 *
 * @param  {TextField} text_field
 * @param  {number} scroll_x
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, scroll_x: number): void =>
{
    if (!text_field.scrollEnabled
        || text_field.autoSize !== "none"
    ) {
        return ;
    }

    // check y animation
    if (text_field.yScrollShape.hasLocalVariable("job")) {
        return ;
    }

    const width = text_field.width;
    scroll_x = $clamp(scroll_x, 0, width + 4, 0);
    if (text_field.scrollX === scroll_x) {
        return ;
    }

    if (text_field.textWidth > width) {

        textFieldApplyChangesService(text_field);

        const xScrollShape = text_field.xScrollShape;
        xScrollShape.width = width * width / text_field.textWidth;

        const parent = text_field.parent;
        if (parent) {

            // start animation
            if (xScrollShape.hasLocalVariable("job")) {
                xScrollShape.getLocalVariable("job").stop();
            }

            // view start
            xScrollShape.alpha = 0.9;

            // set position
            xScrollShape.x = text_field.x + 1
                + (width - 1 - xScrollShape.width)
                / (width - 1)
                * (scroll_x - 1);

            xScrollShape.y = text_field.y + text_field.height
                - xScrollShape.height - 0.5;

            // added sprite
            parent.addChildAt(
                xScrollShape,
                parent.getChildIndex(text_field) + 1
            );

            const job = Tween.add(xScrollShape,
                { "alpha" : 0.9 },
                { "alpha" : 0 },
                0.5, 0.2, Easing.outQuad
            );

            job.addEventListener(Event.COMPLETE, (event: Event): void =>
            {
                const shape = (event.target as Job).target as Shape;
                shape.deleteLocalVariable("job");
                if (shape.parent) {
                    shape.parent.removeChild(shape);
                }
            });
            job.start();

            xScrollShape.setLocalVariable("job", job);
        }

        text_field.$scrollX = scroll_x;
    }

    if (text_field.willTrigger(Event.SCROLL)) {
        text_field.dispatchEvent(new Event(Event.SCROLL, true));
    }
};