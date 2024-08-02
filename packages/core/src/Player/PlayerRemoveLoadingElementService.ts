import { $PREFIX } from "../CoreUtil";

/**
 * @description ローディングのelementを削除
 *              Remove the loading element
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

    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};