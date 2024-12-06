import { $getMainElement, $getCanvas } from "../../CoreUtil";
import { $textArea } from "@next2d/text";

/**
 * @description canvas と textarea elementをメインのdivに追加
 *              Add canvas and textarea element to main div.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLDivElement = $getMainElement();
    if (!element) {
        return ;
    }
    const canvas: HTMLCanvasElement = $getCanvas();
    if (!canvas) {
        return ;
    }

    element.appendChild(canvas);
    element.appendChild($textArea);
};