import type { DisplayObject } from "./DisplayObject";
import type {
    Matrix,
    ColorTransform
} from "@next2d/geom";
import { execute as bitmapDataImageToBufferService } from "./BitmapData/service/BitmapDataImageToBufferService";
import { execute as bitmapDataCanvasToBufferService } from "./BitmapData/service/BitmapDataCanvasToBufferService";
import { execute as bitmapDataDrawToCanvasUseCase } from "./BitmapData/usecase/BitmapDataDrawToCanvasUseCase";

/**
 * @description BitmapData クラスを使用すると、Bitmap オブジェクトのデータ (ピクセル) を処理できます。
 *              BitmapData クラスのメソッドを使用して、任意のサイズの透明または不透明のビットマップイメージを作成し
 *              実行時に様々な方法で操作できます。
 *
 *              The BitmapData class lets you work with the data (pixels) of a Bitmap object.
 *              You can use the methods of the BitmapData class to create arbitrarily sized transparent or
 *              opaque bitmap images and manipulate them in various ways at runtime.
 *
 * @class
 * @memberOf next2d.display
 */
export class BitmapData
{
    /**
     * @description ビットマップイメージの幅（ピクセル単位）です。
     *              The width of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    public width: number;

    /**
     * @description ビットマップイメージの高さ（ピクセル単位）です。
     *              The height of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    public height: number;

    /**
     * @type {Uint8Array | null}
     * @private
     */
    public buffer: Uint8Array | null;

    /**
     * @param {number} [width=0]
     * @param {number} [height=0]
     * @constructor
     * @public
     */
    constructor (width: number = 0, height: number = 0)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this.width = width | 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this.height = height | 0;

        /**
         * @type {Uint8Array}
         * @default null
         * @private
         */
        this.buffer = null;
    }

    /**
     * @description Imageクラスを利用して BitmapData を生成します。
     *              Use the Image class to generate BitmapData.
     *
     * @writeonly
     * @public
     */
    set image (image: HTMLImageElement | null)
    {
        if (!image) {
            this.width  = 0;
            this.height = 0;
            this.buffer = null;
            return ;
        }

        this.buffer = bitmapDataImageToBufferService(image);
        this.width  = image.width;
        this.height = image.height;
    }

    /**
     * @description Canvasクラス利用して BitmapData を生成します。
     *              Use the Canvas class to generate BitmapData.
     *
     * @writeonly
     * @public
     */
    set canvas (canvas: HTMLCanvasElement | null)
    {
        if (!canvas) {
            this.width  = 0;
            this.height = 0;
            this.buffer = null;
            return ;
        }

        this.buffer = bitmapDataCanvasToBufferService(canvas);
        this.width  = canvas.width;
        this.height = canvas.height;
    }

    /**
     * @description 新しいオブジェクトとして、このクラスのクローンを返します。
     *              含まれるオブジェクトはまったく同じコピーになります。
     *              Returns a clone of this class as a new object,
     *              with an exact copy of the contained object.
     *
     * @return {BitmapData}
     * @method
     * @public
     */
    clone (): BitmapData
    {
        const bitmapData = new BitmapData(this.width, this.height);
        if (this.buffer !== null) {
            bitmapData.buffer = this.buffer.slice();
        }
        return bitmapData;
    }

    /**
     * @description 指定された DisplayObject を指定のcanvasに描画します。
     *              Draws the specified DisplayObject to the specified canvas.
     *
     * @param  {DisplayObject}     source
     * @param  {Matrix}            [matrix=null]
     * @param  {ColorTransform}    [color_transform=null]
     * @param  {HTMLCanvasElement} [transferred_canvas=null]
     * @return {Promise<HTMLCanvasElement>}
     * @method
     * @public
     */
    async drawToCanvas <D extends DisplayObject>(
        source: D,
        matrix: Matrix | null = null,
        color_transform: ColorTransform | null = null,
        transferred_canvas: HTMLCanvasElement | null = null
    ): Promise<HTMLCanvasElement> {
        return await bitmapDataDrawToCanvasUseCase(
            this, source,
            matrix, color_transform,
            transferred_canvas
        );
    }
}