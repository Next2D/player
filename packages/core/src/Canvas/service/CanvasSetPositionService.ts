import { $mainCanvasPosition } from "@next2d/text";
import { $stage } from "@next2d/display";
import { $getMainElement } from "../../CoreUtil";

/**
 * @type {number}
 * @private
 */
const $devicePixelRatio: number = window.devicePixelRatio || 1;

/**
 * @description メインキャンバスの位置を設定します。
 *              Set the position of the main canvas.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $mainCanvasPosition.x = 0;
    $mainCanvasPosition.y = 0;

    const element: HTMLDivElement = $getMainElement();
    if (!element) {
        return ;
    }

    const canvas = element.children[0] as HTMLCanvasElement;
    if (!canvas || canvas.localName !== "canvas") {
        return ;
    }

    $mainCanvasPosition.x = (element.clientWidth  - $stage.rendererWidth  / $devicePixelRatio) / 2;
    $mainCanvasPosition.y = (element.clientHeight - $stage.rendererHeight / $devicePixelRatio) / 2;
};