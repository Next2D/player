import type { Shape } from "../../Shape";
import { $cacheStore } from "@next2d/cache";
import { Event } from "@next2d/events";
import { execute as shapeSetBitmapBufferUseCase } from "./ShapeSetBitmapBufferUseCase";

/**
 * @description 指定のURLを画像を読み込み、Shapeに設定
 *              Load the specified URL image and set it to Shape
 *
 * @param  {Shape} shape
 * @param  {string} src
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shape: Shape, src: string): void =>
{
    const image = new Image();
    image.addEventListener("load", (): void =>
    {
        const width  = image.width;
        const height = image.height;

        const canvas  = $cacheStore.getCanvas();
        canvas.width  = width;
        canvas.height = height;

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0, width, height);

        shapeSetBitmapBufferUseCase(
            shape,
            width,
            height,
            new Uint8Array(context.getImageData(0, 0, width, height).data)
        );

        $cacheStore.destroy(context);

        if (shape.hasEventListener(Event.COMPLETE)) {
            shape.dispatchEvent(new Event(Event.COMPLETE));
        }
    });

    image.src = src;
};