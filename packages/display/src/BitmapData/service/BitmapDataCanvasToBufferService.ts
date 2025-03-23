import { $cacheStore } from "@next2d/cache";

/**
 * @description 画像をバッファに変換します
 *              Convert image to buffer
 *
 * @param  {HTMLCanvasElement} canvas
 * @return {Uint8Array}
 * @method
 * @protected
 */
export const execute = (canvas: HTMLCanvasElement): Uint8Array =>
{
    const cloneCanvas  = $cacheStore.getCanvas();
    cloneCanvas.width  = canvas.width;
    cloneCanvas.height = canvas.height;

    const context = cloneCanvas.getContext("2d") as CanvasRenderingContext2D;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(canvas, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const buffer = new Uint8Array(imageData.data.buffer);

    $cacheStore.destroy(context);

    return buffer;
};