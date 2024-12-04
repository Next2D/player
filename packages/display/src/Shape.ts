import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { execute as shapeClearBitmapBufferService } from "./Shape/usecase/ShapeClearBitmapBufferUseCase";
import { execute as shapeSetBitmapBufferUseCase } from "./Shape/usecase/ShapeSetBitmapBufferUseCase";
import { execute as shapeLoadSrcUseCase } from "./Shape/usecase/ShapeLoadSrcUseCase";
import {
    $graphicMap,
    $getArray
} from "./DisplayObjectUtil";

/**
 * @description Shape クラスは、ベクターグラフィックスを表示するための表示オブジェクトです。
 *              The Shape class is a display object for displaying vector graphics.
 *
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
export class Shape extends DisplayObject
{
    /**
     * @type {Graphics}
     * @default null
     * @private
     */
    private _$graphics: Graphics | null;

    /**
     * @type {string}
     * @default ""
     * @private
     */
    private _$src: string;

    /**
     * @description Shapeの機能を所持しているかを返却
     *              Returns whether the display object has Shape functionality.
     *
     * @type {boolean}
     * @readonly
     * @public
     */
    public readonly isShape: boolean;

    /**
     * @description ビルドされたキャッシュキー
     *              Built cache key
     *
     * @type {number}
     * @default 0
     * @public
     */
    public cacheKey: number;

    /**
     * @description キャッシュのビルドに利用されるパラメータ
     *              Parameters used to build the cache
     *
     * @type {number[]}
     * @public
     */
    public readonly cacheParams: number[];

    /**
     * @description ビットマップ描画の判定フラグ
     *              Bitmap drawing judgment flag
     *
     * @type {boolean}
     * @default false
     * @protected
     */
    public isBitmap: boolean;

    /**
     * @description 画像RGBAのUint8Array
     *              Image RGBA Uint8Array
     *
     * @type {Uint8Array|null}
     * @default null
     * @protected
     */
    public $bitmapBuffer: Uint8Array | null;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.isShape     = true;
        this.cacheKey    = 0;
        this.cacheParams = $getArray(0, 0, 0);

        // private
        this._$graphics = null;
        this._$src      = "";

        // bitmap
        this.$bitmapBuffer = null;
        this.isBitmap      = false;
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return {string}
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Shape";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return {string}
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Shape";
    }

    /**
     * @description この Shape オブジェクトに描画されるベクターの描画コマンドを保持する Graphics オブジェクトです。
     *              The Graphics object that belongs to this Shape object, where vector drawing commands can occur.
     *
     * @member  {Graphics}
     * @readonly
     * @public
     */
    get graphics (): Graphics
    {
        if (!this._$graphics) {
            this._$graphics = new Graphics();
            $graphicMap.set(this._$graphics, this);
        }
        return this._$graphics;
    }

    /**
     * @description 指定されたパスから画像を読み込み、Graphicsを生成します
     *              Reads images from the specified path and generates Graphics.
     *
     * @member  {string}
     * @readonly
     * @public
     */
    get src (): string
    {
        return this._$src;
    }
    set src (src: string)
    {
        if (this._$src === src) {
            return ;
        }

        this._$src = src;

        shapeLoadSrcUseCase(this, src);
    }

    /**
     * @description ビットマップデータを解放します
     *              Releases bitmap data.
     *
     * @return {void}
     * @method
     * @public
     */
    clearBitmapBuffer (): void
    {
        shapeClearBitmapBufferService(this);
    }

    /**
     * @description RGBAの画像データを設定します
     *              Sets the RGBA image data.
     *
     * @param {number} width
     * @param {number} height
     * @param {Uint8Array} buffer
     * @method
     * @public
     */
    setBitmapBuffer (width: number, height: number, buffer: Uint8Array): void
    {
        shapeSetBitmapBufferUseCase(
            this,
            width,
            height,
            buffer
        );
    }
}