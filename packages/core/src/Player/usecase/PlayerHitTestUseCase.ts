import { $player } from "../../Player";
import { stage } from "@next2d/display";
import {
    $devicePixelRatio,
    $hitContext,
    $getMainElement,
    $hitObject,
    $hitMatrix
} from "../../CoreUtil";

/**
 * @type {string}
 * @private
 */
let $currentCursor: string = "auto";

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
    $hitMatrix[4] = ($player.rendererWidth  - stage.stageWidth  * $player.rendererScale) / 2;
    $hitMatrix[5] = ($player.rendererHeight - stage.stageHeight * $player.rendererScale) / 2;

    // reset
    $hitContext.beginPath();
    $hitContext.setTransform(1, 0, 0, 1, 0, 0);

    // ヒット判定
    stage.$mouseHit($hitContext, $hitMatrix, $hitObject);

    // カーソルの表示を更新
    if ($player.mouseState === "up"
        && $currentCursor !== $hitObject.pointer
    ) {
        canvas.style.cursor = $currentCursor = $hitObject.pointer;
    }
};