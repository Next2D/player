
import type { IRenderMessage } from "../../interface/IRenderMessage";
import { $rendererWorker } from "../../RendererWorker";
import { stage } from "@next2d/display";
import { renderQueue } from "@next2d/render-queue";
import { $renderMatrix } from "../../CoreUtil";

/**
 * @type {Float32Array}
 * @private
 */
export const $COLOR_ARRAY_IDENTITY: Float32Array = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

/**
 * @type {ImageBitmap[]}
 * @private
 */
const $imageBitmaps: ImageBitmap[] = [];

/**
 * @description レンダリングメッセージ
 *              Rendering message
 *
 * @type {object}
 * @private
 */
const $message: IRenderMessage = {
    "command": "render",
    "buffer": null,
    "length": 0,
    "imageBitmaps": null
};

/**
 * @description Transferableオブジェクト
 *              Transferable object
 *
 * @type {Transferable[]}
 * @private
 */
const $options: Transferable[] = [];

let $limitRenderQueue: boolean = false;
let $pendingRenders: number = 0;

/**
 * @description レンダラーに処理中のまま預けておける描画の数の上限。
 *              1 にすると、返事が届くまで次の描画を送れず、メインとレンダラーが順番待ちになる:
 *              メインが描画を送るまでの時間とレンダラーの 1 回の処理時間の合計が画面の更新 1 回分を
 *              超えると、どちらも単独では間に合っていても 1 コマ抜ける。2 なら、レンダラーが前の描画を
 *              処理している間にメインが次の描画を作って送れる。溜まり続けることはない (上限で止まる)。
 *              The maximum number of renders left with the renderer at a time. With 1, the next
 *              render cannot be sent until the reply arrives, which serializes the two threads: a
 *              frame is dropped whenever the main thread's time before sending plus the renderer's
 *              time for one render exceeds one display refresh, even though each fits on its own.
 *              With 2, the main thread can build and send the next render while the renderer works
 *              on the previous one. The backlog stays bounded by this limit.
 *
 * @type {number}
 * @const
 */
const $MAX_PENDING_RENDERS: number = 2;

// 受け取りイベントを登録
$rendererWorker.addEventListener("message", (event: MessageEvent): void =>
{
    if (event.data.message === "renderFlowControl") {
        $limitRenderQueue = Boolean(event.data.enabled);
        return;
    }
    if (event.data.message !== "render") {
        return ;
    }

    $pendingRenders = Math.max(0, $pendingRenders - 1);

    const buffer = event.data.buffer;
    if (renderQueue.buffer.length > buffer.length) {
        return ;
    }

    renderQueue.buffer = buffer;
});

/**
 * @description レンダリングデータを生成してworkerに送る
 *              Generate rendering data and send it to the worker
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    // Do not generate/consume cache changes while the renderer has a backlog.
    // stage.changed remains set, so the next tick sends the latest display state.
    if ($limitRenderQueue && $pendingRenders >= $MAX_PENDING_RENDERS) {
        return;
    }

    renderQueue.offset   = 0;
    $options.length      = 0;
    $imageBitmaps.length = 0;
    stage.$generateRenderQueue(
        stage, $imageBitmaps, $renderMatrix, $COLOR_ARRAY_IDENTITY
    );

    if (!renderQueue.offset) {
        return ;
    }

    // update buffer
    renderQueue.trim();
    $message.buffer = renderQueue.buffer;
    $message.length = renderQueue.offset;
    $options.push(renderQueue.buffer.buffer);

    // postMessage
    $message.imageBitmaps = null;
    if ($imageBitmaps.length) {
        $message.imageBitmaps = $imageBitmaps;
        $options.push(...$imageBitmaps);
    }

    $rendererWorker.postMessage($message, $options);
    $pendingRenders++;
};
