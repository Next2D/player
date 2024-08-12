import { execute as shapeRenderUseCase } from "../../Shape/usecase/ShapeRenderUseCase";
import { execute as textFieldRenderUseCase } from "../../TextField/usecase/TextFieldRenderUseCase";
import { execute as videoRenderUseCase } from "../../Video/usecase/VideoRenderUseCase";

/**
 * @description DisplayObjectContainerの描画を実行します。
 *              Execute the drawing of DisplayObjectContainer.
 * 
 * @param  {Float32Array} render_queue 
 * @param  {number} index 
 * @return {number}
 * @method
 * @protected
 */
export const execute = (render_queue: Float32Array, index: number): number =>
{
    const length = render_queue[index++];

    let isMaskEnabled = 0;
    for (let idx = 0; length > idx; idx++) {
        const depth = render_queue[index++];
        const clipDepth = render_queue[index++];

        const type = render_queue[index++];

        // hidden
        if (!render_queue[index++]) {
            continue;
        }

        switch (type) {

            case 0x00: // container
                index = execute(render_queue, index);
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
                break;

        }
    }

    return index;
};