import type { PropertyMessageMapImpl } from "./interface/PropertyMessageMapImpl";
import { execute as commandInitializeContextService } from "./Command/CommandInitializeContextService";
import { execute as commandResizeService } from "./Command/CommandResizeService";
import { execute as commandBackgroundColorService } from "./Command/CommandBackgroundColorService";

/**
 * @class
 */
export class CommandController
{
    public state: string;
    public queue: PropertyMessageMapImpl<any>[];
    private readonly _$options: ArrayBuffer[];

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

        /**
         * @type {array}
         * @private
         */
        this._$options = [];
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

                case "draw":
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

                case "setBackgroundColor":
                    commandBackgroundColorService(object.buffer[0] as number);
                    break;

                case "removeCache":
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