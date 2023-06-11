import { CommandController } from "./CommandController";

const command: CommandController = new CommandController();

/**
 * @public
 */
self.addEventListener("message", async (event: MessageEvent) =>
{
    command.queue.push(event.data);
    if (command.state === "deactivate") {
        command.execute();
    }
});