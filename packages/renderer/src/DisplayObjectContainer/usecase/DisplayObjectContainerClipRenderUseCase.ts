import { execute as shapeClipRenderUseCase } from "../../Shape/usecase/ShapeClipRenderUseCase";

/**
 * @description DisplayObjectContainerのマスク描画を実行します。
 *              Execute the mask drawing of DisplayObjectContainer.
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
    for (let idx = 0; idx < length; ++idx) {

        const type = render_queue[index++];
        switch (type) {

            case 0x00: // container
                index = execute(render_queue, index);
                break;

            case 0x01: // shape
                index = shapeClipRenderUseCase(render_queue, index);
                break;

            // text, videoはマスク対象外
            default:
                break;

        }
    }

    return index;
};