import type { Shape } from "../../Shape";
import { execute as shapeClearBitmapBufferService } from "./ShapeClearBitmapBufferUseCase";

/**
 * @description BitmapBufferを設定
 *              Set BitmapBuffer
 *
 * @param  {Shape} shape
 * @param  {number} width
 * @param  {number} height
 * @param  {Uint8Array} buffer
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shape: Shape,
    width: number,
    height: number,
    buffer: Uint8Array
): void => {

    shapeClearBitmapBufferService(shape);

    shape.isBitmap = true;
    shape.$bitmapBuffer = buffer;

    shape.graphics.xMin = 0;
    shape.graphics.yMin = 0;
    shape.graphics.xMax = width;
    shape.graphics.yMax = height;
};