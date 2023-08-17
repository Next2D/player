import type { RenderDisplayObjectImpl } from "./interface/RenderDisplayObjectImpl";
import {
    $renderPlayer,
    $setSafari
} from "./RenderGlobal";
import {
    $MATRIX_ARRAY_IDENTITY,
    $COLOR_ARRAY_IDENTITY,
    $OffscreenCanvas,
    $cacheStore
} from "@next2d/share";

/**
 * @class
 */
export class CommandController
{
    public state: string;
    public queue: any[];

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
    execute (): void
    {
        this.state = "active";

        while (this.queue.length) {

            const object: any = this.queue.shift();
            switch (object.command) {

                case "draw":
                    $renderPlayer._$draw();
                    break;

                case "setProperty":
                    {
                        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }

                        instances.get(object.instanceId)._$update(object);
                    }
                    break;

                case "setChildren":
                    {
                        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }
                        const instance: RenderDisplayObjectImpl<any> = instances.get(object.instanceId);
                        instance._$doChanged();

                        instance._$children = object.children;
                    }
                    break;

                case "remove":
                    {
                        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                        if (!instances.has(object.instanceId)) {
                            continue;
                        }

                        instances.get(object.instanceId)._$remove();
                        instances.delete(object.instanceId);
                    }
                    break;

                case "createShape":
                    $renderPlayer._$createShape(object);
                    break;

                case "createDisplayObjectContainer":
                    $renderPlayer._$createDisplayObjectContainer(object);
                    break;

                case "createTextField":
                    $renderPlayer._$createTextField(object);
                    break;

                case "createVideo":
                    $renderPlayer._$createVideo(object);
                    break;

                case "resize":
                    $renderPlayer._$resize(
                        object.width,
                        object.height,
                        object.scale,
                        object.tx,
                        object.ty
                    );
                    break;

                case "initialize":
                    $renderPlayer._$initialize(
                        object.canvas, object.samples, object.devicePixelRatio
                    );
                    break;

                case "setSafari":
                    $setSafari(object.isSafari);
                    break;

                case "setBackgroundColor":
                    $renderPlayer._$setBackgroundColor(object.backgroundColor);
                    break;

                case "setStage":
                    $renderPlayer._$setStage(object.instanceId);
                    break;

                case "stop":
                    $renderPlayer.stop();
                    break;

                case "removeCache":
                    $cacheStore.removeCache(object.id);
                    break;

                case "bitmapDraw":
                    {
                        const instances: Map<number, RenderDisplayObjectImpl<any>> = $renderPlayer.instances;
                        if (!instances.has(object.sourceId)) {
                            continue;
                        }

                        const instance: RenderDisplayObjectImpl<any> = instances.get(object.sourceId);

                        const canvas: OffscreenCanvas = new $OffscreenCanvas(
                            object.width,
                            object.height
                        );

                        $renderPlayer._$bitmapDraw(
                            instance,
                            object.matrix || $MATRIX_ARRAY_IDENTITY,
                            object.colorTransform || $COLOR_ARRAY_IDENTITY,
                            canvas
                        );

                        const imageBitmap: ImageBitmap = canvas.transferToImageBitmap();
                        globalThis.postMessage({
                            "command": "bitmapDraw",
                            "sourceId": object.sourceId,
                            "imageBitmap": imageBitmap
                        // @ts-ignore
                        }, [imageBitmap]);

                    }
                    break;

                default:
                    break;

            }
        }

        this.state = "deactivate";
    }
}