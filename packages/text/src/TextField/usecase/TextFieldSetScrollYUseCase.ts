import type { TextField } from "../../TextField";
import type { Shape } from "@next2d/display";
import { Event } from "@next2d/events";
import { Tween, Easing, type Job } from "@next2d/ui";
import { $clamp } from "../../TextUtil";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";

/**
 * @description yスクロール位置を設定します
 *              y Sets the scroll position.
 *
 * @param  {TextField} text_field
 * @param  {number} scroll_y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, scroll_y: number): void =>
{
    if (!text_field.scrollEnabled
        || text_field.autoSize !== "none"
        || !text_field.multiline && !text_field.wordWrap
    ) {
        return ;
    }

    // check x animation
    if (text_field.xScrollShape.hasLocalVariable("job")) {
        return ;
    }

    const height = text_field.height;
    scroll_y = $clamp(scroll_y, 0, height + 2, 0);
    if (text_field.scrollY === scroll_y) {
        return ;
    }

    if (text_field.textHeight > height) {

        textFieldApplyChangesService(text_field);

        const yScrollShape = text_field.yScrollShape;
        yScrollShape.height = height * height / text_field.textHeight;

        const parent = text_field.parent;
        if (parent) {

            // start animation
            if (yScrollShape.hasLocalVariable("job")) {
                yScrollShape.getLocalVariable("job").stop();
            }

            // view start
            yScrollShape.alpha = 0.9;

            // set position
            yScrollShape.x = text_field.x + text_field.width - yScrollShape.width - 0.5;
            yScrollShape.y = text_field.y + 0.5
                + (height - 1 - yScrollShape.height)
                / (height - 1)
                * (scroll_y - 1);

            // added sprite
            parent.addChildAt(
                yScrollShape,
                parent.getChildIndex(text_field) + 1
            );

            const job = Tween.add(yScrollShape,
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

            yScrollShape.setLocalVariable("job", job);

            text_field.$scrollY = scroll_y;
        }
    }

    if (text_field.willTrigger(Event.SCROLL)) {
        text_field.dispatchEvent(new Event(Event.SCROLL, true));
    }
};