import { $cacheStore } from "@next2d/cache";
import { $context } from "../../RendererUtil";

const MOVE_TO: number         = 0;
const CURVE_TO: number        = 1;
const LINE_TO: number         = 2;
const CUBIC: number           = 3;
const ARC: number             = 4;
const FILL_STYLE: number      = 5;
const STROKE_STYLE: number    = 6;
const END_FILL: number        = 7;
const END_STROKE: number      = 8;
const BEGIN_PATH: number      = 9;
const GRADIENT_FILL: number   = 10;
const GRADIENT_STROKE: number = 11;
const CLOSE_PATH: number      = 12;
const BITMAP_FILL: number     = 13;
const BITMAP_STROKE: number   = 14;

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
    console.log("cache", hasCache, uniqueKey, cacheKey);
    if (!hasCache) {
        const length = render_queue[index++];
        const end = index + length;
        
        const commands = render_queue.subarray(index, end);
        index += length;

        // while (end > index) {

        //     switch (commands[index++]) {

        //         case 9:
        //             $context.beginPath();
        //             break;


        //     }

        // }

        // todo: draw shape
    } else {
        const cachePosition = $cacheStore.get(uniqueKey, `${cacheKey}`);
        if (!cachePosition) {
            return index;
        }
    }
    
    console.log("render Shape");
    return index;
};