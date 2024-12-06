import { $player } from "../../Player";
import { stage } from "@next2d/display";
import {
    $hitContext,
    $hitObject,
    $hitMatrix,
    $getCanvas
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
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($player.stopFlag) {
        return ;
    }

    $hitObject.x = stage.pointer.x;
    $hitObject.y = stage.pointer.y;
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
        $getCanvas().style.cursor = $currentCursor = $hitObject.pointer;
    }
};