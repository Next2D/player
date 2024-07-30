import type { Player } from "../Player";
import { execute as playerResizePostMessageService } from "./PlayerResizePostMessageService";
import {
    $PREFIX,
    $devicePixelRatio
} from "../CoreUtil";

/**
 * @description 画面リサイズ時にcanvasのリサイズを行う
 *              Resize the canvas when resizing the screen
 *
 * @param  {Player} player
 * @param  {number} initial_width
 * @param  {number} initial_height
 * @param  {boolean} full_screen
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    player: Player,
    initial_width: number,
    initial_height: number,
    full_screen: boolean
): void => {

    const element: HTMLElement | null = document
        .getElementById($PREFIX);

    if (!element) {
        return ;
    }

    const parent: HTMLElement = element.parentElement as HTMLElement;
    if (!parent) {
        return ;
    }

    const screenWidth: number = full_screen || parent.tagName === "BODY"
        ? window.innerWidth
        : parent.clientWidth;

    const screenHeight: number = full_screen || parent.tagName === "BODY"
        ? window.innerHeight
        : parent.clientHeight;

    const style  = element.style;
    style.width  = `${screenWidth}px`;
    style.height = `${screenHeight}px`;

    const scale: number = Math.min(
        screenWidth  / initial_width,
        screenHeight / initial_height
    );

    const width: number = full_screen
        ? window.innerWidth * $devicePixelRatio
        : initial_width * scale * $devicePixelRatio | 0;

    const height: number = full_screen
        ? window.innerHeight * $devicePixelRatio
        : initial_height * scale * $devicePixelRatio | 0;

    // 同じサイズの場合は、ここれで終了
    if (width === player.rendererWidth
        && height === player.rendererHeight
    ) {
        return ;
    }

    // update
    player.rendererScale  = scale;
    player.rendererWidth  = width;
    player.rendererHeight = height;

    // worker postMessage
    playerResizePostMessageService(player);

    if (element.children.length > 1) {
        element.children[1].dispatchEvent(
            new Event(`${$PREFIX}_blur`)
        );
    }
};