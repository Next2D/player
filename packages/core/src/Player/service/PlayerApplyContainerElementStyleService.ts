/**
 * @description コンテナのelementにベースのスタイルを適用
 *              Apply base style to container element
 *
 * @param  {HTMLDivElement} element
 * @param  {number} [fixed_width=0]
 * @param  {number} [fixed_height=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    element: HTMLDivElement,
    fixed_width: number = 0,
    fixed_height: number = 0
): void => {

    let style = "";

    style += "display:flex;";
    style += "align-items:center;";
    style += "justify-content:center;";
    style += "background-color:transparent;";
    style += "overflow:hidden;";
    style += "padding:0;";
    style += "margin:0;";
    style += "user-select:none;";
    style += "outline:none;";

    if (fixed_width && fixed_height) {
        // fixed size
        style += `width:${fixed_width}px;`;
        style += `height:${fixed_height}px;`;
    } else {
        const parent = element.parentElement;
        if (!parent) {
            throw new Error("parent element is null.");
        }

        if (parent.tagName === "BODY") {
            // If the parent is BODY, adjust to window size.
            style += `width:${window.innerWidth}px;`;
            style += `height:${window.innerHeight}px;`;
        } else {
            style += `width:${parent.clientWidth}px;`;
            style += `height:${parent.clientHeight}px;`;
        }
    }

    element.setAttribute("style", style);
};