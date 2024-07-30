// import { $renderPlayer } from "./RenderGlobal";
// import {
//     $MATRIX_ARRAY_IDENTITY,
//     $COLOR_ARRAY_IDENTITY,
//     $OffscreenCanvas,
//     $cacheStore
// } from "@next2d/share";
import type { PropertyMessageMapImpl } from "./interface/PropertyMessageMapImpl";
import type { RenderDisplayObjectImpl } from "./interface/RenderDisplayObjectImpl";

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

        let returnBuffer = true;
        while (this.queue.length) {

            const object: PropertyMessageMapImpl<any> | void = this.queue.shift();
            if (!object) {
                continue;
            }

            returnBuffer = true;
            switch (object.command) {

                // case "draw":
                //     $renderPlayer._$draw();
                //     break;

                // case "setProperty":
                //     {
                //         const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                //         if (!instances.has(object.instanceId)) {
                //             continue;
                //         }

                //         // instances.get(object.instanceId)._$update(object);
                //     }
                //     break;

                // case "setChildren":
                //     {
                //         returnBuffer = false;

                //         const buffer: Float32Array = object.buffer;

                //         const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                //         if (!instances.has(buffer[0])) {
                //             continue;
                //         }

                //         const instance: RenderDisplayObjectImpl<any> = instances.get(buffer[0]);
                //         instance._$doChanged();

                //         instance._$children = buffer.subarray(1);
                //     }
                //     break;

                // case "remove":
                //     {
                //         const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                //         if (!instances.has(object.instanceId)) {
                //             continue;
                //         }

                //         instances.get(object.instanceId)._$remove();
                //         instances.delete(object.instanceId);
                //     }
                //     break;

                // case "createShape":
                //     $renderPlayer._$createShape(object.buffer);
                //     break;

                // case "createDisplayObjectContainer":

                //     $renderPlayer
                //         ._$createDisplayObjectContainer(object.buffer);

                //     break;

                // case "createTextField":
                //     $renderPlayer._$createTextField(object);
                //     break;

                // case "createVideo":
                //     $renderPlayer._$createVideo(object);
                //     break;

                case "resize":
                    $renderPlayer._$resize(object.buffer);
                    break;

                case "initialize":
                    $renderPlayer._$initialize(
                        object.buffer, object.canvas
                    );
                    break;

                case "setBackgroundColor":
                    $renderPlayer._$setBackgroundColor(object.buffer);
                    break;

                // case "stop":
                //     $renderPlayer.stop();
                //     break;

                // case "removeCache":
                //     $cacheStore.removeCache(object.id);
                //     break;

                // case "bitmapDraw":
                //     {
                //         const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                //         if (!instances.has(object.sourceId)) {
                //             continue;
                //         }

                //         const instance: RenderDisplayObjectImpl<any> = instances.get(object.sourceId);

                //         const canvas: OffscreenCanvas = new $OffscreenCanvas(
                //             object.width,
                //             object.height
                //         );

                //         $renderPlayer._$bitmapDraw(
                //             instance,
                //             object.matrix || $MATRIX_ARRAY_IDENTITY,
                //             object.colorTransform || $COLOR_ARRAY_IDENTITY,
                //             canvas
                //         );

                //         const imageBitmap: ImageBitmap = canvas.transferToImageBitmap();
                //         globalThis.postMessage({
                //             "command": "bitmapDraw",
                //             "sourceId": object.sourceId,
                //             "imageBitmap": imageBitmap
                //         // @ts-ignore
                //         }, [imageBitmap]);

                //     }
                //     break;

                // default:
                //     if (object.command.indexOf("shapeRecodes") > -1) {
                //         returnBuffer = false;
                //         const instanceId: number = +object.command.split("@")[1];
                //         $renderPlayer._$registerShapeRecodes(instanceId, object.buffer);
                //     }
                //     break;

            }

            if (object.buffer && returnBuffer) {
                // this._$options.push(object.buffer.buffer);

                // globalThis.postMessage({
                //     "command": "renderBuffer",
                //     "buffer": object.buffer
                // // @ts-ignore
                // }, this._$options);

                // reset
                this._$options.length = 0;
            }
        }

        this.state = "deactivate";
    }
}