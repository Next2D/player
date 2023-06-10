import { CommandController } from "./CommandController";

const command: CommandController = new CommandController();

/**
 * @public
 */
globalThis.addEventListener("message", (event: MessageEvent) =>
{
    command.queue.push(event.data);
    if (command.state === "deactivate") {
        command.execute();
    }
});