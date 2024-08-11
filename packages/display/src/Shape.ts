import type { IPlayerHitObject } from "./interface/IPlayerHitObject";
import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { Event } from "@next2d/events";
import { $graphicMap } from "./DisplayObjectUtil";

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
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        this.isShape = true;

        // private
        this._$graphics = null;
        this._$src      = "";
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

        const image: HTMLImageElement = new Image();
        image.addEventListener("load", () =>
        {
            const width: number  = image.width;
            const height: number = image.height;

            const bitmapData: BitmapData = new BitmapData(width, height);
            bitmapData.image = image;

            this
                .graphics
                .beginBitmapFill(bitmapData)
                .drawRect(0, 0, width, height);

            if (this.hasEventListener(Event.COMPLETE)) {
                this.dispatchEvent(new Event(Event.COMPLETE));
            }
        });

        this._$src = image.src = src;
    }

    // /**
    //  * @param   {Float32Array} [matrix=null]
    //  * @returns {object}
    //  * @method
    //  * @private
    //  */
    // _$getBounds (
    //     matrix: Float32Array | null = null
    // ): BoundsImpl {

    //     if (!this._$graphics) {
    //         return $getBoundsObject(0, 0, 0, 0);
    //     }

    //     const baseBounds: BoundsImpl = this._$graphics._$getBounds();
    //     if (!matrix) {
    //         return baseBounds;
    //     }

    //     let multiMatrix: Float32Array = matrix;

    //     const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //     if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //         || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //         || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //     ) {
    //         multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //     }

    //     const bounds: BoundsImpl = $boundsMatrix(baseBounds, multiMatrix);
    //     $poolBoundsObject(baseBounds);

    //     if (multiMatrix !== matrix) {
    //         $poolFloat32Array6(multiMatrix);
    //     }

    //     return bounds;
    // }

    /**
     * @description マウスイベントのヒットテストを行います。
     *              Performs a hit test on a display object by testing a point against all visible children.
     * 
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @return {boolean}
     * @method
     * @private
     */
    _$mouseHit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: IPlayerHitObject
    ): boolean {

        if (!this._$visible) {
            return false;
        }

        return this._$hit(context, matrix, options);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object} options
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (
        context: CanvasRenderingContext2D,
        matrix: Float32Array,
        options: IPlayerHitObject,
    ): boolean {

        const graphics: Graphics | null = this._$graphics;
        if (!graphics || !graphics.isDrawable) {
            return false;
        }

        let multiMatrix: Float32Array = matrix;
        // const rawMatrix: Float32Array = this._$transform._$rawMatrix();
        // if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
        //     || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
        //     || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        // ) {
        //     multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
        // }

        const hit = graphics._$hit(
            context,
            multiMatrix,
            options
        );

        // if (multiMatrix !== matrix) {
        //     $poolFloat32Array6(multiMatrix);
        // }

        return hit;
    }
}