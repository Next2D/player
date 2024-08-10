import type { IShapeCharacter } from "./interface/IShapeCharacter";
import type { IPlayerHitObject } from "./interface/IPlayerHitObject";
import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { Event } from "@next2d/events";
import { $graphicMap } from "./DisplayObjectUtil";
import { execute as graphicsToNumberArrayService } from "./Graphics/service/GraphicsToNumberArrayService";

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
    private _$graphics: Graphics | null;
    private _$src: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Graphics}
         * @default null
         * @private
         */
        this._$graphics = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$src = "";
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

    /**
     * @description キャラクター情報からShapeを構築
     *              Build Shape from character information
     *
     * @param  {object} character
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character: IShapeCharacter): void
    {
        const graphics: Graphics = this.graphics;

        const width: number  = Math.ceil(Math.abs(character.bounds.xMax - character.bounds.xMin));
        const height: number = Math.ceil(Math.abs(character.bounds.yMax - character.bounds.yMin));

        // fixed logic
        graphics.xMin = character.bounds.xMin;
        graphics.xMax = character.bounds.xMax;
        graphics.yMin = character.bounds.yMin;
        graphics.yMax = character.bounds.yMax;

        if (character.recodes) {

            switch (true) {

            //     case character.bitmapId > 0:
            //         {
            //             const bitmap: Character<ShapeCharacterImpl> = loaderInfo
            //                 ._$data
            //                 .characters[character.bitmapId];

            //             if (!bitmap.buffer) {
            //                 throw new Error("the bitmap buffer is null.");
            //             }

            //             const width: number  = $Math.abs(bitmap.bounds.xMax - bitmap.bounds.xMin);
            //             const height: number = $Math.abs(bitmap.bounds.yMax - bitmap.bounds.yMin);

            //             const bitmapData: BitmapData = new BitmapData(width, height);
            //             if (!bitmap._$buffer) {
            //                 bitmap._$buffer = new Uint8Array(bitmap.buffer);
            //                 $poolArray(bitmap.buffer);
            //                 bitmap.buffer = null;
            //             }
            //             bitmapData.buffer = bitmap._$buffer.slice();

            //             // setup
            //             graphics._$recode = $getArray();

            //             if (width === character.bounds.xMax - character.bounds.xMin
            //                 && height === character.bounds.yMax - character.bounds.yMin
            //             ) {
            //                 graphics._$bitmapId = character.bitmapId;
            //                 graphics._$mode     = "bitmap";
            //             }

            //             // clone
            //             const recodes: any[] = character.recodes;
            //             if (recodes[recodes.length - 1] === Graphics.END_FILL) {

            //                 const length: number  = recodes.length - 6;
            //                 for (let idx: number = 0; idx < length; ++idx) {
            //                     graphics._$recode.push(recodes[idx]);
            //                 }

            //                 // add Bitmap Fill
            //                 graphics._$recode.push(
            //                     Graphics.BITMAP_FILL,
            //                     bitmapData,
            //                     null,
            //                     "repeat",
            //                     false
            //                 );

            //             } else {

            //                 const width: number          = recodes[recodes.length - 9];
            //                 const caps: CapsStyleImpl    = recodes[recodes.length - 8];
            //                 const joints: JointStyleImpl = recodes[recodes.length - 7];
            //                 const miterLimit: number     = recodes[recodes.length - 6];

            //                 const length: number = recodes.length - 10;
            //                 for (let idx: number = 0; idx < length; ++idx) {
            //                     graphics._$recode.push(recodes[idx]);
            //                 }

            //                 graphics._$recode.push(
            //                     Graphics.BITMAP_STROKE,
            //                     width,
            //                     caps,
            //                     joints,
            //                     miterLimit,
            //                     bitmapData,
            //                     $getFloat32Array6(
            //                         1, 0, 0, 1, character.bounds.xMin, character.bounds.yMin
            //                     ),
            //                     "repeat",
            //                     false
            //                 );
            //             }
            //         }
            //         break;

            //     case character.inBitmap:
            //         {
            //             // setup
            //             graphics._$recode = $getArray();

            //             const recodes: any[] = character.recodes;
            //             for (let idx: number = 0; idx < recodes.length; ++idx) {

            //                 const value: BitmapData = recodes[idx];
            //                 graphics._$recode[idx] = value;

            //                 if (typeof value !== "object") {
            //                     continue;
            //                 }

            //                 if (!value.buffer) {
            //                     continue;
            //                 }

            //                 const bitmapData: BitmapData = new BitmapData(
            //                     value.width, value.height
            //                 );
            //                 bitmapData.buffer = new Uint8Array(value.buffer);
            //                 graphics._$recode[idx++] = bitmapData;

            //                 const matrix: number[] = recodes[idx];
            //                 graphics._$recode[idx] = $getFloat32Array6(
            //                     matrix[0], matrix[1], matrix[2],
            //                     matrix[3], matrix[4], matrix[5]
            //                 );

            //                 if (value.width === character.bounds.xMax - character.bounds.xMin
            //                     && value.height === character.bounds.yMax - character.bounds.yMin
            //                 ) {
            //                     graphics._$bitmapId = character.bitmapId;
            //                     graphics._$mode     = "bitmap";
            //                 }
            //             }
            //         }
            //         break;

                default:
                    if (!character.recodeBuffer) {
                        character.recodeBuffer = new Float32Array(
                            graphicsToNumberArrayService(width, height, character.recodes)
                        );
                    }
                    graphics.buffer = character.recodeBuffer.slice(0);
                    break;

            }

        } else {

            // graphics._$mode = "bitmap";

            // const width: number  = $Math.abs(character.bounds.xMax - character.bounds.xMin);
            // const height: number = $Math.abs(character.bounds.yMax - character.bounds.yMin);

            // const bitmapData: BitmapData = new BitmapData(width, height);
            // if (!character._$buffer) {
            //     if (!character.buffer) {
            //         throw new Error("the bitmap buffer is null.");
            //     }
            //     character._$buffer = new Uint8Array(character.buffer);
            //     $poolArray(character.buffer);
            //     character.buffer = null;
            // }
            // bitmapData.buffer = character._$buffer.slice(0);

            // graphics
            //     .beginBitmapFill(bitmapData, null, false)
            //     .drawRect(0, 0, width, height);

        }

        // // 9-scale
        // if (character.grid) {
        //     this._$scale9Grid = new Rectangle(
        //         character.grid.x, character.grid.y,
        //         character.grid.w, character.grid.h
        //     );
        // }
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