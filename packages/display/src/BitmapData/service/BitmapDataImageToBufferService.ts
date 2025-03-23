import { $cacheStore } from "@next2d/cache";

/**
 * @description 画像をバッファに変換します
 *              Convert image to buffer
 *
 * @param  {HTMLImageElement} image
 * @return {Uint8Array}
 * @method
 * @protected
 */
export const execute = (image: HTMLImageElement): Uint8Array =>
{
    const canvas  = $cacheStore.getCanvas();
    canvas.width  = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d", { "willReadFrequently": true }) as CanvasRenderingContext2D;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, image.width, image.height);
    const buffer = new Uint8Array(imageData.data.buffer);

    $cacheStore.destroy(context);

    return buffer;
};