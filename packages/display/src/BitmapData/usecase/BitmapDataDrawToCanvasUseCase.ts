import type { BitmapData } from "../../BitmapData";
import type { DisplayObject } from "../../DisplayObject";
import type {
    Matrix,
    ColorTransform
} from "@next2d/geom";
import { $cacheStore } from "@next2d/cache";

/**
 * @description 指定の DisplayObject インスタンスをビットマップイメージに描画します。
 *              Draws the specified DisplayObject instance to the bitmap image.
 *
 * @param  {BitmapData} bitmap_data
 * @param  {D} source
 * @param  {Matrix} [matrix=null]
 * @param  {ColorTransform} [color_transform=null]
 * @param  {HTMLCanvasElement} [transferred_canvas=null]
 * @return {HTMLCanvasElement}
 * @method
 * @protected
 */
export const execute = async <D extends DisplayObject>(
    bitmap_data: BitmapData,
    source: D,
    matrix: Matrix | null = null,
    color_transform: ColorTransform | null = null,
    transferred_canvas: HTMLCanvasElement | null = null
): Promise<HTMLCanvasElement> => {
    console.log(
        bitmap_data,
        source,
        matrix,
        color_transform
    );
    const canvas = transferred_canvas || $cacheStore.getCanvas();
    return canvas;
};