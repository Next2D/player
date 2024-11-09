import { $player } from "../../Player";
import {
    $stage,
    $setCurrentMousePoint
} from "@next2d/display";
import {
    $PREFIX,
    $devicePixelRatio
} from "../../CoreUtil";

/**
 * @description 現在のマウスの位置を取得します。
 *              Get the current mouse position.
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: PointerEvent): void =>
{
    let x = window.scrollX;
    let y = window.scrollY;

    const div: HTMLElement | null = document
        .getElementById($PREFIX);

    if (div) {
        const rect = div.getBoundingClientRect();
        x += rect.left;
        y += rect.top;
    }

    const tx = ($player.rendererWidth - $stage.stageWidth * $player.rendererScale) / 2;
    const ty = ($player.rendererHeight - $stage.stageHeight * $player.rendererScale) / 2;

    const scale = $player.rendererScale / $devicePixelRatio;
    $setCurrentMousePoint(
        (event.pageX - x) / scale - tx / $player.rendererScale,
        (event.pageY - y) / scale - ty / $player.rendererScale
    );
};