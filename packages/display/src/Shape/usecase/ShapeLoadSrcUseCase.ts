import type { Shape } from "../../Shape";
import { $cacheStore } from "@next2d/cache";
import { Event } from "@next2d/events";
import { execute as shapeSetBitmapBufferUseCase } from "./ShapeSetBitmapBufferUseCase";
import { execute as shapeGenerateBitmapKeyService } from "../service/ShapeGenerateBitmapKeyService";

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
    image.crossOrigin = "anonymous";
    image.addEventListener("load", (): void =>
    {
        const width  = image.width;
        const height = image.height;

        const canvas  = $cacheStore.getCanvas();
        canvas.width  = width;
        canvas.height = height;

        const context = canvas.getContext("2d", { "willReadFrequently": true }) as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0, width, height);

        // getImageData が返す配列は呼び出しごとに新しく作られるので、複写せずにそのまま参照する
        // (複写すると、画像 1 枚につき全ピクセルの複写が 1 回増える)
        const data   = context.getImageData(0, 0, width, height).data;
        const buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        shapeSetBitmapBufferUseCase(shape, width, height, buffer);

        // 読み込み元のURLから uniqueKey を決める。未設定のままだと、描画時に全ピクセルを
        // ハッシュしてキーを作るため、大きな画像ではその計算だけでフレームが止まる。
        // (shapeSetBitmapBufferUseCase が uniqueKey を空に戻すので、その後に設定する)
        shape.uniqueKey = `${shapeGenerateBitmapKeyService(src, width, height, buffer)}`;

        $cacheStore.destroy(context);

        if (shape.hasEventListener(Event.COMPLETE)) {
            shape.dispatchEvent(new Event(Event.COMPLETE));
        }
    });

    image.src = src;
};