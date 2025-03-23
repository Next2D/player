import { execute as displayObjectContainerRenderUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerRenderUseCase";
import { execute as shapeRenderUseCase } from "../../Shape/usecase/ShapeRenderUseCase";
import { execute as textFieldRenderUseCase } from "../../TextField/usecase/TextFieldRenderUseCase";
import { execute as videoRenderUseCase } from "../../Video/usecase/VideoRenderUseCase";
import { $context } from "../../RendererUtil";

/**
 * @description 描画コマンドから描画を実行してcanvasに描画して返却
 *              Execute drawing from drawing command and draw to canvas and return
 *
 * @param  {Float32Array} render_queue
 * @param  {number} width
 * @param  {number} height
 * @param  {ImageBitmap[]} [image_bitmaps=null]
 * @return {Promise<ImageBitmap>}
 * @method
 * @protected
 */
export const execute = async (
    render_queue: Float32Array,
    width: number,
    height: number,
    image_bitmaps: ImageBitmap[] | null
): Promise<ImageBitmap> => {

    // reset transfer bounds
    $context.clearTransferBounds();

    let index = 1;

    // reset
    $context.reset();
    $context.setTransform(1, 0, 0, 1, 0, 0);
    $context.fillBackgroundColor();

    while (render_queue.length > index) {

        // hidden
        if (!render_queue[index++]) {
            continue;
        }

        // display object type
        const type = render_queue[index++];
        switch (type) {

            case 0x00: // container
                index = displayObjectContainerRenderUseCase(render_queue, index, image_bitmaps);
                break;

            case 0x01: // shape
                index = shapeRenderUseCase(render_queue, index);
                break;

            case 0x02: // text
                index = textFieldRenderUseCase(render_queue, index);
                break;

            case 0x03: // video
                index = videoRenderUseCase(render_queue, index, image_bitmaps);
                break;

            default:
                console.error("unknown type", type);
                break;

        }
    }

    $context.drawArraysInstanced();

    return await $context.createImageBitmap(width, height);
};