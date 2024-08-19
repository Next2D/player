import { execute as displayObjectContainerRenderUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerRenderUseCase";
import { execute as shapeRenderUseCase } from "../../Shape/usecase/ShapeRenderUseCase";
import { execute as textFieldRenderUseCase } from "../../TextField/usecase/TextFieldRenderUseCase";
import { execute as videoRenderUseCase } from "../../Video/usecase/VideoRenderUseCase";
import {
    $rendererWidth,
    $rendererHeight,
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
    let index = 0;
    // update background color
    const color = render_queue[index++];
    if ($color !== color) {
        $color = color;
        if ($color === -1) {
            $context.updateBackgroundColor(0, 0, 0, 1);
        } else {
            $context.updateBackgroundColor(
                $color >> 16 & 0xff / 255,
                $color >> 8 & 0xff / 255,
                $color & 0xff / 255,
                1
            );
        }
    }

    // reset
    $context.reset();
    $context.setTransform(1, 0, 0, 1, 0, 0);
    $context.clearRect(0, 0, $rendererWidth, $rendererHeight);
    // $context.fillBackgroundColor();

    while (render_queue.length > index) {

        // display object type
        const type = render_queue[index++];

        // hidden
        if (!render_queue[index++]) {
            continue;
        }

        switch (type) {

            case 0x00: // container
                index = displayObjectContainerRenderUseCase(render_queue, index);
                break;

            case 0x01: // shape
                index = shapeRenderUseCase(render_queue, index);
                break;

            case 0x02: // text
                index = textFieldRenderUseCase(render_queue, index);
                break;

            case 0x03: // video
                index = videoRenderUseCase(render_queue, index);
                break;

            default:
                console.error("unknown type", type);
                break;

        }
    }

    $context.drawArraysInstanced();
    $context.transferMainCanvas();
};