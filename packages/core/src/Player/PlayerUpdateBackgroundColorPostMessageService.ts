import type { UpdateBackgroundColorMessageImpl } from "../interface/UpdateBackgroundColorMessageImpl";
import {
    $rendererWorker,
    $hitContext
} from "../CoreUtil";

/**
 * @description リサイズメッセージ
 *              Resize message
 *
 * @type {UpdateBackgroundColorMessageImpl}
 * @private
 */
const message: UpdateBackgroundColorMessageImpl = {
    "command": "setBackgroundColor",
    "buffer": null
};

/**
 * @description Transferableオブジェクト
 *              Transferable object
 *
 * @type {Transferable[]}
 * @private
 */
const options: Transferable[] = [];

/**
 * @description 背景色を変更をworkerに通知
 *              Notify the worker of the background color change
 *
 * @param  {string} background_color
 * @return {void}
 * @method
 * @protected
 */
export const execute = (background_color: string): void =>
{
    let color = -1;
    if (background_color === "transparent") {
        $hitContext.fillStyle = background_color;
        color = +`0x${$hitContext.fillStyle.slice(1)}`;
    }

    // postMessage
    message.buffer = new Float32Array([color]);

    options[0] = message.buffer.buffer;

    $rendererWorker.postMessage(message, options);
};