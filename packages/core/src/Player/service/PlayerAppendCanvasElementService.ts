import { $PREFIX } from "../../CoreUtil";
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
    const element: HTMLElement | null = document.getElementById($PREFIX);
    if (!element) {
        return ;
    }
    element.appendChild($canvas);
};