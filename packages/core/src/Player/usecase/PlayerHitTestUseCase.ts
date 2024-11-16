import { $player } from "../../Player";
import { $stage } from "@next2d/display";
import { PointerEvent as Next2D_PointerEvent } from "@next2d/events";
import {
    $devicePixelRatio,
    $hitContext,
    $getMainElement,
    $hitObject
} from "../../CoreUtil";

/**
 * @type {Float32Array}
 * @private
 */
const $matrix: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {string}
 * @private
 */
let $currentCursor: string = "auto";

/**
 * @type {NodeJS.Timeout}
 * @private
 */
let $timerId: NodeJS.Timeout;

/**
 * @type {boolean}
 * @private
 */
let $wait: boolean = false;

/**
 * @description Playerの当たり判定
 *              Player hit test
 *
 * @param  {PointerEvent} event
 * @param  {HTMLCanvasElement} canvas
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: PointerEvent, canvas: HTMLCanvasElement): void =>
{
    if ($player.stopFlag) {
        return ;
    }

    let x = window.scrollX;
    let y = window.scrollY;

    const div = $getMainElement();
    if (div) {
        const rect = div.getBoundingClientRect();
        x += rect.left;
        y += rect.top;

        x += ($player.screenWidth - $player.rendererWidth / $devicePixelRatio) / 2;
        y += ($player.screenHeight - $player.rendererHeight / $devicePixelRatio) / 2;
    }

    const scale  = $player.rendererScale / $devicePixelRatio;
    $hitObject.x = (event.pageX - x) / scale;
    $hitObject.y = (event.pageY - y) / scale;
    $hitObject.pointer = "auto";
    $hitObject.hit = null;

    // hit test
    $matrix[4] = ($player.rendererWidth  - $stage.stageWidth  * $player.rendererScale) / 2;
    $matrix[5] = ($player.rendererHeight - $stage.stageHeight * $player.rendererScale) / 2;

    // reset
    $hitContext.beginPath();
    $hitContext.setTransform(1, 0, 0, 1, 0, 0);

    // ヒット判定
    $stage.$mouseHit($hitContext, $matrix, $hitObject);

    // ヒットしたオブジェクトがある場合
    if ($hitObject.hit) {
        event.preventDefault();
    }

    // カーソルの表示を更新
    if ($currentCursor !== $hitObject.pointer) {
        canvas.style.cursor = $currentCursor = $hitObject.pointer;
    }

    switch (true) {

        // ヒットしたオブジェクトがある場合
        case $hitObject.hit === null:
            break;

            // ヒットしたオブジェクトがない場合
        default:
            break;
    }

    switch (event.type) {

        case Next2D_PointerEvent.POINTER_DOWN:
            clearTimeout($timerId);
            if (!$wait) {

                // 初回のタップであればダブルタップを待機モードに変更
                $wait = true;

                // ダブルタップ有効期限をセット
                $timerId = setTimeout((): void =>
                {
                    $wait = false;
                }, 300);

            } else {

                // ダブルタップを終了
                $wait = false;

            }
            break;

        case Next2D_PointerEvent.POINTER_UP:
            break;

        case Next2D_PointerEvent.POINTER_MOVE:
            break;

    }
};