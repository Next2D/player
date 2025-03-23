import { $player } from "../../Player";
import {
    $PREFIX,
    $setMainElement
} from "../../CoreUtil";

/**
 * @description コンテナとなるElementを作成して返却
 *              Create and return an Element that serves as a container
 *
 * @return {HTMLDivElement}
 * @method
 * @protected
 */
export const execute = (): HTMLDivElement =>
{
    const div: HTMLDivElement = document.createElement("div");
    $setMainElement(div);

    div.id       = $PREFIX;
    div.tabIndex = -1;

    if (!$player.tagId) {
        document.body.appendChild(div);
    } else {
        const element: HTMLElement | null = document.getElementById($player.tagId);
        if (!element) {
            alert(`Element not found with tag ID: ${$player.tagId}`);
            return div;
        }
        element.appendChild(div);
    }

    return div;
};