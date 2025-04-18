import type { IMessage } from "./interface/IMessage";
import { execute as commandInitializeContextService } from "./Command/service/CommandInitializeContextService";
import { execute as commandResizeService } from "./Command/service/CommandResizeService";
import { execute as commandRenderUseCase } from "./Command/usecase/CommandRenderUseCase";
import { execute as commandRemoveCacheService } from "./Command/service/CommandRemoveCacheService";
import { execute as commandCaptureUseCase } from "./Command/usecase/CommandCaptureUseCase";
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
     * @return {Promise<void>}
     * @method
     * @public
     */
    async execute (): Promise<void>
    {
        this.state = "active";
        while (this.queue.length) {

            const object: IMessage | void = this.queue.shift();
            if (!object) {
                continue;
            }

            switch (object.command) {

                case "render":
                    commandRenderUseCase(
                        object.buffer.subarray(0, object.length),
                        object.imageBitmaps as ImageBitmap[] | null
                    );

                    // 描画完了したらメインスレッドにbufferを返却する
                    globalThis.postMessage({
                        "message": "render",
                        "buffer": object.buffer
                    // @ts-ignore
                    }, [object.buffer.buffer]);
                    break;

                case "resize":
                    commandResizeService(
                        object.buffer[0] as number,
                        object.buffer[1] as number,
                        Boolean(object.buffer[2])
                    );
                    break;

                case "initialize":
                    commandInitializeContextService(
                        object.canvas as OffscreenCanvas,
                        object.devicePixelRatio as number
                    );
                    break;

                case "removeCache":
                    commandRemoveCacheService(object.buffer);
                    break;

                case "cacheClear":
                    $cacheStore.reset();
                    break;

                case "capture":
                    {
                        const imageBitmap = await commandCaptureUseCase(
                            object.buffer.subarray(0, object.length),
                            object.width as number,
                            object.height as number,
                            object.imageBitmaps as ImageBitmap[] | null
                        );

                        // 描画完了したらメインスレッドにbufferを返却する
                        globalThis.postMessage({
                            "message": "capture",
                            "buffer": object.buffer,
                            "imageBitmap": imageBitmap
                        // @ts-ignore
                        }, [object.buffer.buffer, imageBitmap]);
                    }
                    break;

                default:
                    break;

            }
        }

        this.state = "deactivate";
    }
}