import type { IMessage } from "./interface/IMessage";
import { execute as commandInitializeContextService } from "./Command/service/CommandInitializeContextService";
import { execute as commandResizeService } from "./Command/service/CommandResizeService";
import { execute as commandRenderUseCase } from "./Command/usecase/CommandRenderUseCase";
import { $cacheStore } from "@next2d/cache";

/**
 * @class
 */
export class CommandController
{
    /**
     * @description workerの実行状態
     *              Execution status of worker
     * 
     * @type {string}
     * @default "deactivate"
     * @public
     */
    public state: string;

    /**
     * @description 受け取ったメッセージ配列
     *              Received message array
     * 
     * @type {array}
     * @default []
     * @public
     */
    public queue: IMessage[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.state = "deactivate";
        this.queue = [];
    }

    /**
     * @description 処理を実行
     *              Execute process
     *
     * @return {void}
     * @method
     * @public
     */
    execute (): void
    {
        this.state = "active";
        while (this.queue.length) {

            const object: IMessage | void = this.queue.shift();
            if (!object) {
                continue;
            }

            switch (object.command) {

                case "render":
                    commandRenderUseCase(object.buffer);
                    break;

                case "resize":
                    commandResizeService(
                        object.buffer[0] as number,
                        object.buffer[1] as number,
                    );
                    break;

                case "initialize":
                    commandInitializeContextService(
                        object.canvas as OffscreenCanvas, 
                        object.buffer[0] as number
                    );
                    break;

                case "removeClear":
                    $cacheStore.removeCache(`${object.buffer[0] as number}`);
                    break;

                case "cacheClear":
                    $cacheStore.reset();
                    break;

                case "bitmapDraw":
                    // todo
                    break;

                default:
                    break;

            }
        }

        this.state = "deactivate";
    }
}