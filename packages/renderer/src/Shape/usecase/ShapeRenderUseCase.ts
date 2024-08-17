import { $cacheStore } from "@next2d/cache";
import { execute as shapeCommandService } from "../service/ShapeCommandService"; 
import { $context } from "../../RendererUtil"; 

/**
 * @description Shapeの描画を実行します。
 *              Execute the drawing of Shape.
 *
 * @param  {Float32Array} render_queue
 * @param  {number} index 
 * @return {number}
 * @method
 * @protected
 */
export const execute = (render_queue: Float32Array, index: number): number =>
{
    const matrix = render_queue.subarray(index, index + 6);
    index += 6;

    const colorTransform = render_queue.subarray(index, index + 8);
    index += 8;

    const hasGrid = render_queue[index++];

    // baseBounds
    const xMin = render_queue[index++];
    const yMin = render_queue[index++];
    const xMax = render_queue[index++];
    const yMax = render_queue[index++];

    // cache uniqueKey
    const uniqueKey = render_queue[index++] === 2 
        ? `${render_queue[index++]}@${render_queue[index++]}`
        : `${render_queue[index++]}`;

    const cacheKey = render_queue[index++];

    const hasCache = render_queue[index++];
    // console.log("cache", hasCache, uniqueKey, cacheKey);
    if (!hasCache) {

        const currentAttachment = $context.currentAttachmentObject;
        console.log("currentAttachment", currentAttachment);

        const length = render_queue[index++];
        const commands = render_queue.subarray(index, index + length);
        shapeCommandService(commands);
        
        index += length;

    } else {
        const cachePosition = $cacheStore.get(uniqueKey, `${cacheKey}`);
        if (!cachePosition) {
            return index;
        }
    }
    
    return index;
};