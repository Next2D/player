import { $PREFIX } from "../CoreUtil";

/**
 * @description コンテナとなるElementを作成して返却
 *              Create and return an Element that serves as a container
 *
 * @param  {string} [tag_id=""]
 * @return {HTMLDivElement}
 * @method
 * @protected
 */
export const execute = (tag_id: string = ""): HTMLDivElement =>
{
    const div: HTMLDivElement = document.createElement("div");
    div.id       = $PREFIX;
    div.tabIndex = -1;

    if (!tag_id) {
        document.body.appendChild(div);
    } else {
        const element: HTMLElement | null = document.getElementById(tag_id);
        if (!element) {
            alert(`Element not found with tag ID: ${tag_id}`);
            return div;
        }
        element.appendChild(div);
    }

    return div;
};