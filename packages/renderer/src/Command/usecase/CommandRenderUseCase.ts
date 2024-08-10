import {
    $canvas,
    $context
} from "../../RendererUtil"; 

/**
 * @type {number}
 * @private
 */
let $color: number = -1;

/**
 * @description 描画コマンドから描画を実行
 *              Execute drawing from drawing command
 * 
 * @param {Float32Array} render_queue
 * @return {void}
 * @method
 * @protected
 */
export const execute = (render_queue: Float32Array): void =>
{
    // update background color
    const color = render_queue[0];
    if ($color !== color) {
        $color = color;
        if ($color === -1) {
            $context.updateBackgroundColor(0, 0, 0, 0);
        } else {
            $context.updateBackgroundColor(
                $color >> 16 & 0xff,
                $color >> 8 & 0xff,
                $color & 0xff,
                1
            );
        }
    }

    // reset
    $context.reset();
    $context.setTransform(1, 0, 0, 1, 0, 0);
    $context.clearRect(0, 0, $canvas.width, $canvas.height);
    $context.beginPath();

    // todo
    // ...

    // excute
    $context.drawInstacedArray();
    $context
        .frameBuffer
        .transferToMainTexture();
};