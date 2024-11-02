import type { TextField } from "../../TextField";
import { Event } from "@next2d/events";
import { Tween } from "@next2d/ui";
import { $clamp } from "../../TextUtil";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";

/**
 * @description x スクロール位置を設定します
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
    // check y animation
    if (text_field.yScrollShape
        && text_field.yScrollShape.hasLocalVariable("job")
    ) {
        return ;
    }

    scroll_x = $clamp(scroll_x, 0, text_field.width + 0.5, 0);
    if (text_field.scrollX === scroll_x) {
        return ;
    }

    const width: number = text_field.width;
    if (text_field.xScrollShape && text_field.textWidth > width) {

        textFieldApplyChangesService(text_field);

        this._$scrollX = scroll_x;

        text_field.xScrollShape.width = width * width / text_field.textWidth;
        const parent = text_field.parent;
        if (parent) {

            // start animation
            if (text_field.xScrollShape.hasLocalVariable("job")) {
                text_field.xScrollShape.getLocalVariable("job").stop();
            }

            // view start
            text_field.xScrollShape.alpha = 0.9;

            // set position
            this._$xScrollShape.x = this.x + 1
                + (width - 1 - this._$xScrollShape.width)
                / (width - 1)
                * (this._$scrollX - 1);
            this._$xScrollShape.y = this.y + this.height - this._$xScrollShape.height - 0.5;

            // added sprite
            parent.addChildAt(
                text_field.xScrollShape,
                parent.getChildIndex(text_field) + 1
            );

            const job = Tween.add(this._$xScrollShape,
                { "alpha" : 0.9 },
                { "alpha" : 0 },
                0.5, 0.2, Easing.outQuad
            );

            job.addEventListener(Next2DEvent.COMPLETE, (event: Next2DEvent) =>
            {
                const shape: Shape = event.target.target;
                shape.deleteLocalVariable("job");
                if (shape.parent) {
                    shape.parent.removeChild(shape);
                }
            });
            job.start();

            this._$xScrollShape.setLocalVariable("job", job);
        }

    }

    if (text_field.willTrigger(Event.SCROLL)) {
        text_field.dispatchEvent(new Event(Event.SCROLL, true));
    }
};