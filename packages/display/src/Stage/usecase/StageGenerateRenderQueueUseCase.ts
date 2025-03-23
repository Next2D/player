import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";
import type { Shape } from "../../Shape";
import type { Video } from "@next2d/media";
import type { TextField } from "@next2d/text";
import { renderQueue } from "@next2d/render-queue";
import { stage } from "../../Stage";
import { execute as displayObjectContainerGenerateRenderQueueUseCase } from "../../DisplayObjectContainer/usecase/DisplayObjectContainerGenerateRenderQueueUseCase";
import { execute as shapeGenerateRenderQueueUseCase } from "../../Shape/usecase/ShapeGenerateRenderQueueUseCase";
import { execute as videoGenerateRenderQueueUseCase } from "../../Video/usecase/VideoGenerateRenderQueueUseCase";
import { execute as textFieldGenerateRenderQueueUseCase } from "../../TextField/usecase/TextFieldGenerateRenderQueueUseCase";

/**
 * @description renderer workerに渡す描画データを生成
 *              Generate rendering data to be passed to the renderer worker
 *
 * @param  {D} display_object
 * @param  {ImageBitmap[]} image_bitmaps
 * @param  {Float32Array} matrix
 * @param  {Float32Array} color_transform
 * @param  {number} renderer_width
 * @param  {number} renderer_height
 * @param  {number} point_x
 * @param  {number} point_y
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (
    display_object: D,
    image_bitmaps: ImageBitmap[],
    matrix: Float32Array,
    color_transform: Float32Array,
    renderer_width: number,
    renderer_height: number,
    point_x: number,
    point_y: number
): void => {

    renderQueue.push(stage.backgroundColor);

    switch (true) {

        case display_object.isContainerEnabled: // 0x00
            displayObjectContainerGenerateRenderQueueUseCase(
                display_object as unknown as DisplayObjectContainer,
                image_bitmaps,
                matrix,
                color_transform,
                renderer_width,
                renderer_height,
                point_x,
                point_y
            );
            break;

        case display_object.isShape: // 0x01
            shapeGenerateRenderQueueUseCase(
                display_object as unknown as Shape,
                matrix,
                color_transform,
                renderer_width,
                renderer_height,
                point_x,
                point_y
            );
            break;

        case display_object.isText: // 0x02
            textFieldGenerateRenderQueueUseCase(
                display_object as unknown as TextField,
                matrix,
                color_transform,
                renderer_width,
                renderer_height,
                point_x,
                point_y
            );
            break;

        case display_object.isVideo: // 0x03
            videoGenerateRenderQueueUseCase(
                display_object as unknown as Video,
                image_bitmaps,
                matrix,
                color_transform,
                renderer_width,
                renderer_height,
                point_x,
                point_y
            );
            break;

        default:
            break;

    }

    display_object.changed = false;
};