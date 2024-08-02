"use strict";

import { CommandController } from "./CommandController";

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
self.addEventListener("message", async (event: MessageEvent): Promise<void> =>
{
    console.log(event.data);
    command.queue.push(event.data);
    if (command.state === "deactivate") {
        await command.execute();
    }
});

export default {};