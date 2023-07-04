import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { Player } from "@next2d/core";
import {
    CacheStore,
    $COLOR_ARRAY_IDENTITY,
    $getArray,
    $MATRIX_ARRAY_IDENTITY,
    $multiplicationMatrix,
    $poolArray
} from "@next2d/share";
import {
    CanvasToWebGLContext,
    FrameBufferManager
} from "@next2d/webgl";
import {
    DisplayObjectImpl,
    AttachmentImpl,
    PropertyBitmapDataMessageImpl
} from "@next2d/interface";
import {
    Matrix,
    ColorTransform
} from "@next2d/geom";
import {
    $getInstanceId,
    $bitmapDrawMap,
    $currentPlayer,
    $poolColorTransform,
    $poolMatrix,
    $postContainerWorker,
    $rendererWorker
} from "@next2d/util";

/**
 * BitmapData クラスを使用すると、Bitmap オブジェクトのデータ (ピクセル) を処理できます。
 * BitmapData クラスのメソッドを使用して、任意のサイズの透明または不透明のビットマップイメージを作成し
 * 実行時に様々な方法で操作できます。
 *
 * The BitmapData class lets you work with the data (pixels) of a Bitmap object.
 * You can use the methods of the BitmapData class to create arbitrarily sized transparent or
 * opaque bitmap images and manipulate them in various ways at runtime.
 *
 * @class
 * @memberOf next2d.display
 */
export class BitmapData
{
    private readonly _$instanceId: number;
    private _$width: number;
    private _$height: number;
    _$buffer: Uint8Array|null;
    private _$image: HTMLImageElement|null;
    private _$canvas: HTMLCanvasElement|null;
    private _$pixelBuffer: WebGLBuffer|null;

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
        this._$instanceId = $getInstanceId();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = width | 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = height | 0;

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

        /**
         * @type {WebGLBuffer}
         * @type {null}
         * @private
         */
        this._$pixelBuffer = null;
    }

    /**
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class BitmapData]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class BitmapData]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.BitmapData
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.BitmapData";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object BitmapData]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object BitmapData]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.BitmapData
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.BitmapData";
    }

    /**
     * @description ビットマップイメージの高さ（ピクセル単位）です。
     *              The height of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get height (): number
    {
        return this._$height;
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
        this._$buffer = buffer;
    }

    /**
     * @description Imageクラスを利用して BitmapData を生成します。
     *              Use the Image class to generate BitmapData.
     *
     * @return {HTMLImageElement}
     * @public
     */
    get image (): HTMLImageElement|null
    {
        return this._$image;
    }
    set image (image: HTMLImageElement|null)
    {
        this._$canvas = null;
        this._$image  = image;

        if (!image) {
            return ;
        }

        this._$width  = image.width;
        this._$height = image.height;
    }

    /**
     * @description Canvasクラス利用して BitmapData を生成します。
     *              Use the Canvas class to generate BitmapData.
     *
     * @return {HTMLCanvasElement}
     * @public
     */
    get canvas (): HTMLCanvasElement|null
    {
        return this._$canvas;
    }
    set canvas (canvas: HTMLCanvasElement|null)
    {
        this._$image  = null;
        this._$canvas = canvas;

        if (!canvas) {
            return ;
        }

        this._$width  = canvas.width;
        this._$height = canvas.height;
    }

    /**
     * @description ビットマップイメージの幅（ピクセル単位）です。
     *              The width of the bitmap image in pixels.
     *
     * @return  {number}
     * @readonly
     * @public
     */
    get width (): number
    {
        return this._$width;
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

            const player: Player = $currentPlayer();
            const cacheStore: CacheStore = player.cacheStore;

            const canvas: HTMLCanvasElement = cacheStore.getCanvas();
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

    /**
     * @member {WebGLTexture}
     * @method
     * @private
     */
    getTexture (): WebGLTexture | null
    {
        const { width, height } = this;
        if (!width || !height) {
            return null;
        }

        const player: Player = $currentPlayer();
        const context: CanvasToWebGLContext | null = player.context;
        if (!context) {
            throw new Error("the context is null.");
        }

        if (this._$image !== null) {
            return context
                .frameBuffer
                .createTextureFromImage(this._$image);
        }

        if (this._$canvas !== null) {
            return context
                .frameBuffer
                .createTextureFromCanvas(this._$canvas);
        }

        if (this._$buffer !== null) {
            return context
                .frameBuffer
                .createTextureFromPixels(
                    width, height, this._$buffer, true
                );
        }

        return null;
    }

    /**
     * @param  {DisplayObject}     source
     * @param  {Matrix}            [matrix=null]
     * @param  {ColorTransform}    [color_transform=null]
     * @param  {HTMLCanvasElement} [canvas=null]
     * @param  {function}          [callback=null]
     * @return {void}
     * @public
     */
    draw (
        source: DisplayObjectImpl<any>,
        matrix: Matrix | null = null,
        color_transform: ColorTransform | null = null,
        canvas: HTMLCanvasElement | null = null,
        callback: Function | null = null
    ): void {

        const { width, height } = this;
        if (!width || !height) {
            return ;
        }

        const player: Player = $currentPlayer();
        const cacheWidth: number  = player._$width;
        const cacheHeight: number = player._$height;
        const resize: boolean = width > cacheWidth || height > cacheHeight;
        if (resize) {
            player._$width  = width;
            player._$height = height;
            player._$resizeCanvas(width, height, player.scaleX);
        }

        const colorTransform: Float32Array = color_transform
            ? color_transform._$colorTransform
            : $COLOR_ARRAY_IDENTITY;

        let tMatrix: Float32Array = matrix
            ? matrix._$matrix
            : $MATRIX_ARRAY_IDENTITY;

        if (matrix) {

            const matrix: Matrix = source._$transform.matrix;
            matrix.invert();

            tMatrix = $multiplicationMatrix(
                tMatrix, matrix._$matrix
            );

            $poolMatrix(matrix);
        }

        if (!canvas) {
            canvas = player.cacheStore.getCanvas();
        }

        if ($rendererWorker) {

            if (!source._$stage) {
                if (source instanceof DisplayObjectContainer) {

                    if ($postContainerWorker) {
                        $postContainerWorker(source);
                    }

                } else {

                    source._$createWorkerInstance();
                    source._$postProperty();

                }
            }

            canvas.width  = width;
            canvas.height = height;
            const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
            if (!context) {
                throw new Error("the context is null.");
            }

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, width, height);

            const instanceId: number = source._$instanceId;
            $bitmapDrawMap.set(instanceId, {
                "source": source,
                "context": context,
                "callback": callback
            });

            const options: ArrayBuffer[] = $getArray();
            const message: PropertyBitmapDataMessageImpl = {
                "command": "bitmapDraw",
                "sourceId": instanceId,
                "width": width,
                "height": height
            };

            if (tMatrix[0] !== 1 || tMatrix[1] !== 0
                || tMatrix[2] !== 0 || tMatrix[3] !== 1
                || tMatrix[4] !== 0 || tMatrix[5] !== 0
            ) {
                message.matrix = tMatrix.slice();
                options.push(message.matrix.buffer);
            }

            if (colorTransform[0] !== 1 || colorTransform[1] !== 1
                || colorTransform[2] !== 1 || colorTransform[3] !== 1
                || colorTransform[4] !== 0 || colorTransform[5] !== 0
                || colorTransform[6] !== 0 || colorTransform[7] !== 0
            ) {
                message.colorTransform = colorTransform.slice();
                options.push(message.colorTransform.buffer);
            }

            $rendererWorker.postMessage(message, options);

            $poolArray(options);

        } else {

            const context: CanvasToWebGLContext | null = player.context;
            if (!context) {
                throw new Error("the context is null.");
            }

            const manager: FrameBufferManager = context.frameBuffer;

            const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

            context._$bind(player._$attachment);

            // reset
            context.reset();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, player._$width, player._$height);
            context.beginPath();

            source._$draw(context, tMatrix, colorTransform);

            const texture: WebGLTexture = manager
                .getTextureFromCurrentAttachment();

            // reset and draw to main canvas
            manager.unbind();

            context.reset();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, texture.width + 1, texture.height + 1);
            context.drawImage(texture,
                0, 0, texture.width, texture.height
            );

            canvas.width  = width;
            canvas.height = height;
            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
            if (!ctx) {
                return ;
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(player.canvas, 0, 0);

            if (currentAttachment) {
                context._$bind(currentAttachment);
            }

            if (callback) {
                callback(canvas);
            }
        }

        if (matrix) {
            $poolMatrix(matrix);
        }

        if (color_transform) {
            $poolColorTransform(color_transform);
        }
    }
}
