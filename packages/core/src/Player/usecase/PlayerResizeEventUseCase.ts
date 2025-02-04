import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { execute as playerResizePostMessageService } from "../service/PlayerResizePostMessageService";
import { execute as canvasSetPositionService } from "../../Canvas/service/CanvasSetPositionService";
import { $cacheStore } from "@next2d/cache";
import {
    $PREFIX,
    $getMainElement,
    $devicePixelRatio,
    $renderMatrix
} from "../../CoreUtil";

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
    const element: HTMLDivElement = $getMainElement();
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

    if (!stage.stageWidth || !stage.stageHeight) {
        return ;
    }

    const scale = Math.min(
        screenWidth  / stage.stageWidth,
        screenHeight / stage.stageHeight
    ) * $devicePixelRatio;

    const width = $player.fullScreen
        ? window.innerWidth * $devicePixelRatio
        : stage.stageWidth * scale | 0;

    const height = $player.fullScreen
        ? window.innerHeight * $devicePixelRatio
        : stage.stageHeight * scale | 0;

    // 同じサイズの場合は、ここれで終了
    if (width === $player.screenWidth
        && height === $player.screenHeight
    ) {
        return ;
    }

    // update
    $player.screenWidth  = screenWidth;
    $player.screenHeight = screenHeight;
    stage.changed = true;

    if (element.children.length > 1) {
        element.children[1].dispatchEvent(
            new Event(`${$PREFIX}_blur`)
        );
    }

    // set canvas position
    canvasSetPositionService();

    if (width === $player.rendererWidth
        && height === $player.rendererHeight
    ) {
        return ;
    }

    // update
    stage.rendererScale  = $player.rendererScale  = scale;
    stage.rendererWidth  = $player.rendererWidth  = width;
    stage.rendererHeight = $player.rendererHeight = height;

    // 描画用の matrix を更新
    $renderMatrix[0] = $renderMatrix[3] = scale;
    $renderMatrix[4] = ($player.rendererWidth  - stage.stageWidth  * scale) / 2;
    $renderMatrix[5] = ($player.rendererHeight - stage.stageHeight * scale) / 2;

    // cache clear
    $cacheStore.reset();

    // worker postMessage
    playerResizePostMessageService();
};