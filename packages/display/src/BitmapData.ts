import { execute as bitmapDataImageToBufferService } from "./BitmapData/service/BitmapDataImageToBufferService";
import { execute as bitmapDataCanvasToBufferService } from "./BitmapData/service/BitmapDataCanvasToBufferService";

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
     * @public
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
        this.width  = width | 0;
        this.height = height | 0;
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
}