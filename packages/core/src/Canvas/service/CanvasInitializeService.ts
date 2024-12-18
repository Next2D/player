/**
 * @description canvasのスタイルの初期設定
 *              Initial setting of canvas style
 *
 * @param  {HTMLCanvasElement} canvas
 * @param  {number} [ratio=1]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    canvas: HTMLCanvasElement,
    ratio: number = 1
): void => {

    // Set canvas style
    let style = "";
    style += "-webkit-tap-highlight-color: rgba(0,0,0,0);";
    style += "backface-visibility: hidden;";
    style += "touch-action: none;";

    if (ratio > 1) {
        style += `transform: scale(${1 / ratio});`;
    }

    canvas.width  = 1;
    canvas.height = 1;
    canvas.setAttribute("style", style);
};