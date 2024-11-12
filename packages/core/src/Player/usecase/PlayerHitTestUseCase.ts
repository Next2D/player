import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import { $player } from "../../Player";
import { $canvas } from "../../Canvas";
import { $stage } from "@next2d/display";
import {
    $devicePixelRatio,
    $hitContext,
    $getMainElement
} from "../../CoreUtil";

/**
 * @type {Float32Array}
 * @private
 */
const $matrix: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

/**
 * @type {IPlayerHitObject}
 * @private
 */
const $hitObject: IPlayerHitObject = {
    "x": 0,
    "y": 0,
    "pointer": "",
    "hit": null
};

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
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: PointerEvent): void =>
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
    }

    if ($canvas) {
        const rect = $canvas.getBoundingClientRect();
        x += rect.left;
        y += rect.top;
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

    // カーソルの表示を更新
    if ($currentCursor !== $hitObject.pointer) {
        $currentCursor = $hitObject.pointer;
        $canvas.style.cursor = $hitObject.pointer
    }
};