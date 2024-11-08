"use strict";

import { CommandController } from "./CommandController";

/**
 * @description CommandControllerのインスタンス
 *              Instance of CommandController
 *
 * @type {CommandController}
 * @public
 */
const command: CommandController = new CommandController();

/**
 * @description OffscreenCanvasのメッセージイベント
 *              OffscreenCanvas message event
 *
 * @params {MessageEvent} event
 * @return {void}
 * @method
 * @public
 */
self.addEventListener("message", (event: MessageEvent): void =>
{
    // console.log(event.data);
    command.queue.push(event.data);
    if (command.state === "deactivate") {
        command.execute();
    }
});

export default {};