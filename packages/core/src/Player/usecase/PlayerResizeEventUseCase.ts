import { $player } from "../../Player";
import { $stage } from "@next2d/display";
import { execute as playerResizePostMessageService } from "../service/PlayerResizePostMessageService";
import {
    $PREFIX,
    $devicePixelRatio
} from "../../CoreUtil";
import { $cacheStore } from "@next2d/cache";

/**
 * @description 画面リサイズ時にcanvasのリサイズを行う
 *              Resize the canvas when resizing the screen
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($PREFIX);

    if (!element) {
        return ;
    }

    const parent: HTMLElement = element.parentElement as HTMLElement;
    if (!parent) {
        return ;
    }

    const screenWidth = $player.fullScreen || parent.tagName === "BODY"
        ? window.innerWidth
        : parent.clientWidth;

    const screenHeight = $player.fullScreen || parent.tagName === "BODY"
        ? window.innerHeight
        : parent.clientHeight;

    const style  = element.style;
    style.width  = `${screenWidth}px`;
    style.height = `${screenHeight}px`;

    if (!$stage.stageWidth || !$stage.stageHeight) {
        return ;
    }

    const scale = Math.min(
        screenWidth  / $stage.stageWidth,
        screenHeight / $stage.stageHeight
    ) * $devicePixelRatio;

    const width = $player.fullScreen
        ? window.innerWidth * $devicePixelRatio
        : $stage.stageWidth * scale | 0;

    const height = $player.fullScreen
        ? window.innerHeight * $devicePixelRatio
        : $stage.stageHeight * scale | 0;

    // 同じサイズの場合は、ここれで終了
    if (width === $player.screenWidth
        && height === $player.screenHeight
    ) {
        return ;
    }

    // update
    $player.screenWidth   = screenWidth;
    $player.screenHeight  = screenHeight;
    $stage.rendererScale  = $player.rendererScale  = scale;
    $stage.rendererWidth  = $player.rendererWidth  = width;
    $stage.rendererHeight = $player.rendererHeight = height;
    $stage.changed = true;

    // worker postMessage
    playerResizePostMessageService();

    // cache clear
    $cacheStore.reset();

    if (element.children.length > 1) {
        element.children[1].dispatchEvent(
            new Event(`${$PREFIX}_blur`)
        );
    }
};