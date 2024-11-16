import { $getMainElement } from "../../CoreUtil";
import { $canvas } from "../../Canvas";

/**
 * @description canvas elementをメインのdivに追加
 *              Add canvas element to main div
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
    element.appendChild($canvas);
};