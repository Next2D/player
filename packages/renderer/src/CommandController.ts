import type { PropertyMessageMapImpl } from "./interface/PropertyMessageMapImpl";
import { execute as commandInitializeContextService } from "./Command/service/CommandInitializeContextService";
import { execute as commandResizeService } from "./Command/service/CommandResizeService";
import { execute as commandRenderUseCase } from "./Command/usecase/CommandRenderUseCase";
import { $cacheStore } from "@next2d/cache";

/**
 * @class
 */
export class CommandController
{
    public state: string;
    public queue: PropertyMessageMapImpl<any>[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {string}
         * @default "deactivate"
         * @public
         */
        this.state = "deactivate";

        /**
         * @type {array}
         * @public
         */
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
    async execute (): Promise<void>
    {
        this.state = "active";

        // let returnBuffer = true;
        while (this.queue.length) {

            const object: PropertyMessageMapImpl<any> | void = this.queue.shift();
            if (!object) {
                continue;
            }

            // returnBuffer = true;
            switch (object.command) {

                case "render":
                    commandRenderUseCase(object.buffer);
                    break;

                case "resize":
                    commandResizeService(
                        object.buffer[0] as number,
                        object.buffer[1] as number,
                        object.buffer[2] as number,
                        object.buffer[3] as number,
                        object.buffer[4] as number,
                        !!object.buffer[5]
                    );
                    break;

                case "initialize":
                    commandInitializeContextService(
                        object.canvas, object.buffer[0] as number
                    );
                    break;

                case "removeCache":
                    $cacheStore.removeCache(
                        new TextDecoder().decode(object.buffer[0])
                    );
                    // todo
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