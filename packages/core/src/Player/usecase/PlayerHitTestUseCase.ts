import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import { $player } from "../../Player";
import { $canvas } from "../../Canvas";
import { $stage } from "@next2d/display";
import {
    $PREFIX,
    $devicePixelRatio,
    $hitContext
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
    if (!$player.stopFlag) {
        return ;
    }

    let x = window.scrollX;
    let y = window.scrollY;

    const div: HTMLElement | null = document
        .getElementById($PREFIX);

    if (div) {
        const rect = div.getBoundingClientRect();
        x += rect.left;
        y += rect.top;
    }

    let pageX = event.pageX;
    let pageY = event.pageY;

    // drop point
    const scale  = $player.rendererScale / $devicePixelRatio;
    const stageX = (pageX - x) / scale;
    const stageY = (pageY - y) / scale;

    // reset
    $hitContext.beginPath();
    $hitContext.setTransform(1, 0, 0, 1, 0, 0);

    $hitObject.x = stageX;
    $hitObject.y = stageY;
    $hitObject.pointer = "auto";
    $hitObject.hit = null;

    // hit test

    $matrix[4] = ($player.rendererWidth  - $stage.stageWidth  * $player.rendererScale) / 2;
    $matrix[5] = ($player.rendererHeight - $stage.stageHeight * $player.rendererScale) / 2;

    $stage.$mouseHit($hitContext, $matrix, $hitObject);

    console.log($hitObject.pointer);
    $canvas.style.cursor = $hitObject.pointer;
};