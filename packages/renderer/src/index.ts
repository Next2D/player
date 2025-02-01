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
 * @return {Promise<void>}
 * @method
 * @public
 */
self.addEventListener("message", async (event: MessageEvent): Promise<void> =>
{
    command.queue.push(event.data);
    if (command.state === "deactivate") {
        await command.execute();
    }
});

export default {};