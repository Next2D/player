import type { Player } from "../../Player";
import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
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
 * @param  {Player} player
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (player: Player, event: PointerEvent): void =>
{
    if (!player.stopFlag) {
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
    const scale  = player.rendererScale / $devicePixelRatio;
    const stageX = (pageX - x) / scale;
    const stageY = (pageY - y) / scale;

    // reset
    $hitContext.setTransform(1, 0, 0, 1, 0, 0);
    $hitContext.beginPath();

    $hitObject.x = 0;
    $hitObject.y = 0;
    $hitObject.pointer = "";
    $hitObject.hit = null;

    // hit test
    $matrix[4] = (player.rendererWidth  - $stage.stageWidth  * player.rendererScale) / 2;
    $matrix[5] = (player.rendererHeight - $stage.stageHeight * player.rendererScale) / 2;

    $stage.$mouseHit($hitContext, $matrix, $hitObject);
};