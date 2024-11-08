
import { $getInstanceId } from "./DisplayObjectUtil";
import { $cacheStore } from "@next2d/cache";

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
     * @description DisplayObject のユニークなインスタンスID
     *              Unique instance ID of DisplayObject
     *
     * @type {number}
     * @readonly
     * @public
     */
    public readonly instanceId: number;

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

    private _$buffer: Uint8Array | null;
    private _$image: HTMLImageElement | null;
    private _$canvas: HTMLCanvasElement | null;

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
         * @private
         */
        this.instanceId = $getInstanceId();

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
        this._$buffer = null;

        /**
         * @type {HTMLImageElement}
         * @default null
         * @private
         */
        this._$image = null;

        /**
         * @type {HTMLCanvasElement}
         * @default null
         * @private
         */
        this._$canvas = null;
    }

    /**
     * @description Uint8Arrayを利用して BitmapData を生成します。
     *              Generates BitmapData using Uint8Array.
     *
     * @return {Uint8Array}
     * @public
     */
    get buffer (): Uint8Array | null
    {
        return this._$buffer;
    }
    set buffer (buffer: Uint8Array | null)
    {
        this._$canvas = null;
        this._$image  = null;
        this._$buffer = buffer;
    }

    /**
     * @description Imageクラスを利用して BitmapData を生成します。
     *              Use the Image class to generate BitmapData.
     *
     * @return {HTMLImageElement | null}
     * @public
     */
    get image (): HTMLImageElement | null
    {
        return this._$image;
    }
    set image (image: HTMLImageElement | null)
    {
        this._$canvas = null;
        this._$buffer = null;
        this._$image  = image;

        if (!image) {
            return ;
        }

        this.width  = image.width;
        this.height = image.height;
    }

    /**
     * @description Canvasクラス利用して BitmapData を生成します。
     *              Use the Canvas class to generate BitmapData.
     *
     * @return {HTMLCanvasElement | null}
     * @public
     */
    get canvas (): HTMLCanvasElement | null
    {
        return this._$canvas;
    }
    set canvas (canvas: HTMLCanvasElement | null)
    {
        this._$image  = null;
        this._$buffer = null;
        this._$canvas = canvas;

        if (!canvas) {
            return ;
        }

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
        const bitmapData: BitmapData = new BitmapData(this.width, this.height);
        if (this._$image !== null || this._$canvas !== null) {

            const canvas: HTMLCanvasElement = $cacheStore.getCanvas();
            canvas.width  = this.width;
            canvas.height = this.height;

            const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
            if (!context) {
                throw new Error("the context is null.");
            }

            if (this._$image) {
                context.drawImage(this._$image, 0, 0);
            }

            if (this._$canvas) {
                context.drawImage(this._$canvas, 0, 0);
            }

            bitmapData.canvas = canvas;

        } else if (this._$buffer !== null) {

            bitmapData._$buffer = this._$buffer.slice();

        }

        return bitmapData;
    }

    // /**
    //  * @description 指定された DisplayObject を指定のcanvasに描画します。
    //  *              Draws the specified DisplayObject to the specified canvas.
    //  *
    //  * @param  {DisplayObject}     source
    //  * @param  {Matrix}            [matrix=null]
    //  * @param  {ColorTransform}    [color_transform=null]
    //  * @param  {HTMLCanvasElement} [canvas=null]
    //  * @param  {function}          [callback=null]
    //  * @return {void}
    //  * @public
    //  */
    // drawToCanvas <D extends DisplayObject>(
    //     source: D,
    //     matrix: Matrix | null = null,
    //     color_transform: ColorTransform | null = null,
    //     canvas: HTMLCanvasElement | null = null,
    //     callback: Function | null = null
    // ): void {
    //     // todo
    // }
}
