import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { Event } from "@next2d/events";

/**
 * Shape クラスには、Graphics クラスからメソッドにアクセスできる graphics プロパティがあります。
 *
 * The Shape class includes a graphics property,
 * which lets you access methods from the Graphics class.
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
     * @description 指定されたクラスのストリングを返します。
     *              Returns the string representation of the specified class.
     *
     * @return  {string}
     * @default [class Shape]
     * @method
     * @static
     */
    static toString (): string
    {
        return "[class Shape]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display.Shape
     * @const
     * @static
     */
    static get namespace (): string
    {
        return "next2d.display.Shape";
    }

    /**
     * @description 指定されたオブジェクトのストリングを返します。
     *              Returns the string representation of the specified object.
     *
     * @return  {string}
     * @default [object Shape]
     * @method
     * @public
     */
    toString (): string
    {
        return "[object Shape]";
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default next2d.display.Shape
     * @const
     * @public
     */
    get namespace (): string
    {
        return "next2d.display.Shape";
    }

    /**
     * @description ベクターの描画コマンドが発生するこのスプライトに属する Graphics オブジェクトを指定します。
     *              Specifies the Graphics object that belongs to this sprite
     *              where vector drawing commands can occur.
     *
     * @member  {Graphics}
     * @readonly
     * @public
     */
    get graphics (): Graphics
    {
        if (!this._$graphics) {
            this._$graphics = new Graphics(this);
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
        if (!src) {
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

            if (this.hasEventListener(Event.LOAD)) {
                this.dispatchEvent(new Event(Event.LOAD));
            }
        });

        this._$src = image.src = src;
        this.graphics._$mode = "bitmap";
    }

    // /**
    //  * @param  {object} character
    //  * @param  {LoaderInfo} loaderInfo
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$buildCharacter (
    //     character: Character<ShapeCharacterImpl>,
    //     loaderInfo: LoaderInfo
    // ): void {

    //     const graphics: Graphics = this.graphics;

    //     if (!loaderInfo._$data) {
    //         throw new Error("the loaderInfo data is null.");
    //     }

    //     if (character.recodes) {

    //         switch (true) {

    //             case character.bitmapId > 0:
    //                 {
    //                     const bitmap: Character<ShapeCharacterImpl> = loaderInfo
    //                         ._$data
    //                         .characters[character.bitmapId];

    //                     if (!bitmap.buffer) {
    //                         throw new Error("the bitmap buffer is null.");
    //                     }

    //                     const width: number  = $Math.abs(bitmap.bounds.xMax - bitmap.bounds.xMin);
    //                     const height: number = $Math.abs(bitmap.bounds.yMax - bitmap.bounds.yMin);

    //                     const bitmapData: BitmapData = new BitmapData(width, height);
    //                     if (!bitmap._$buffer) {
    //                         bitmap._$buffer = new Uint8Array(bitmap.buffer);
    //                         $poolArray(bitmap.buffer);
    //                         bitmap.buffer = null;
    //                     }
    //                     bitmapData.buffer = bitmap._$buffer.slice();

    //                     // setup
    //                     graphics._$recode = $getArray();

    //                     if (width === character.bounds.xMax - character.bounds.xMin
    //                         && height === character.bounds.yMax - character.bounds.yMin
    //                     ) {
    //                         graphics._$bitmapId = character.bitmapId;
    //                         graphics._$mode     = "bitmap";
    //                     }

    //                     // clone
    //                     const recodes: any[] = character.recodes;
    //                     if (recodes[recodes.length - 1] === Graphics.END_FILL) {

    //                         const length: number  = recodes.length - 6;
    //                         for (let idx: number = 0; idx < length; ++idx) {
    //                             graphics._$recode.push(recodes[idx]);
    //                         }

    //                         // add Bitmap Fill
    //                         graphics._$recode.push(
    //                             Graphics.BITMAP_FILL,
    //                             bitmapData,
    //                             null,
    //                             "repeat",
    //                             false
    //                         );

    //                     } else {

    //                         const width: number          = recodes[recodes.length - 9];
    //                         const caps: CapsStyleImpl    = recodes[recodes.length - 8];
    //                         const joints: JointStyleImpl = recodes[recodes.length - 7];
    //                         const miterLimit: number     = recodes[recodes.length - 6];

    //                         const length: number = recodes.length - 10;
    //                         for (let idx: number = 0; idx < length; ++idx) {
    //                             graphics._$recode.push(recodes[idx]);
    //                         }

    //                         graphics._$recode.push(
    //                             Graphics.BITMAP_STROKE,
    //                             width,
    //                             caps,
    //                             joints,
    //                             miterLimit,
    //                             bitmapData,
    //                             $getFloat32Array6(
    //                                 1, 0, 0, 1, character.bounds.xMin, character.bounds.yMin
    //                             ),
    //                             "repeat",
    //                             false
    //                         );
    //                     }
    //                 }
    //                 break;

    //             case character.inBitmap:
    //                 {
    //                     // setup
    //                     graphics._$recode = $getArray();

    //                     const recodes: any[] = character.recodes;
    //                     for (let idx: number = 0; idx < recodes.length; ++idx) {

    //                         const value: BitmapData = recodes[idx];
    //                         graphics._$recode[idx] = value;

    //                         if (typeof value !== "object") {
    //                             continue;
    //                         }

    //                         if (!value.buffer) {
    //                             continue;
    //                         }

    //                         const bitmapData: BitmapData = new BitmapData(
    //                             value.width, value.height
    //                         );
    //                         bitmapData.buffer = new Uint8Array(value.buffer);
    //                         graphics._$recode[idx++] = bitmapData;

    //                         const matrix: number[] = recodes[idx];
    //                         graphics._$recode[idx] = $getFloat32Array6(
    //                             matrix[0], matrix[1], matrix[2],
    //                             matrix[3], matrix[4], matrix[5]
    //                         );

    //                         if (value.width === character.bounds.xMax - character.bounds.xMin
    //                             && value.height === character.bounds.yMax - character.bounds.yMin
    //                         ) {
    //                             graphics._$bitmapId = character.bitmapId;
    //                             graphics._$mode     = "bitmap";
    //                         }
    //                     }
    //                 }
    //                 break;

    //             default:
    //                 graphics._$recode = character.recodes.slice(0);
    //                 break;

    //         }

    //     } else {

    //         graphics._$mode = "bitmap";

    //         const width: number  = $Math.abs(character.bounds.xMax - character.bounds.xMin);
    //         const height: number = $Math.abs(character.bounds.yMax - character.bounds.yMin);

    //         const bitmapData: BitmapData = new BitmapData(width, height);
    //         if (!character._$buffer) {
    //             if (!character.buffer) {
    //                 throw new Error("the bitmap buffer is null.");
    //             }
    //             character._$buffer = new Uint8Array(character.buffer);
    //             $poolArray(character.buffer);
    //             character.buffer = null;
    //         }
    //         bitmapData.buffer = character._$buffer.slice(0);

    //         graphics
    //             .beginBitmapFill(bitmapData, null, false)
    //             .drawRect(0, 0, width, height);

    //     }

    //     graphics._$maxAlpha = 1;
    //     graphics._$canDraw  = true;

    //     graphics._$xMin = character.bounds.xMin;
    //     graphics._$xMax = character.bounds.xMax;
    //     graphics._$yMin = character.bounds.yMin;
    //     graphics._$yMax = character.bounds.yMax;

    //     // 9-scale
    //     if (character.grid) {
    //         this._$scale9Grid = new Rectangle(
    //             character.grid.x, character.grid.y,
    //             character.grid.w, character.grid.h
    //         );
    //     }

    //     if ($rendererWorker && this._$stage) {
    //         this._$createWorkerInstance();
    //     }
    // }

    // /**
    //  * @param  {object} character
    //  * @return {void}
    //  * @method
    //  * @protected
    //  */
    // _$sync (character: ShapeCharacterImpl): void
    // {
    //     if (this._$loaderInfo) {
    //         this._$buildCharacter(character, this._$loaderInfo);
    //     }
    // }

    // /**
    //  * @param  {object} tag
    //  * @param  {DisplayObjectContainer} parent
    //  * @return {object}
    //  * @method
    //  * @private
    //  */
    // _$build (
    //     tag: DictionaryTagImpl,
    //     parent: ParentImpl<any>
    // ): ShapeCharacterImpl {

    //     const character: ShapeCharacterImpl = this
    //         ._$baseBuild<ShapeCharacterImpl>(tag, parent);

    //     this._$buildCharacter(character, parent._$loaderInfo);

    //     return character;
    // }

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

    // /**
    //  * @param  {CanvasToWebGLContext} context
    //  * @param  {Float32Array} matrix
    //  * @param  {Float32Array} color_transform
    //  * @return {void}
    //  * @method
    //  * @private
    //  */
    // _$draw (
    //     context: CanvasToWebGLContext,
    //     matrix: Float32Array,
    //     color_transform: Float32Array
    // ): void {

    //     if (!this._$visible) {
    //         return ;
    //     }

    //     if (!this._$graphics || !this._$graphics._$canDraw) {
    //         return ;
    //     }

    //     let multiColor: Float32Array = color_transform;
    //     const rawColor: Float32Array = this._$transform._$rawColorTransform();
    //     if (rawColor !== $COLOR_ARRAY_IDENTITY
    //         && rawColor[0] !== 1 || rawColor[1] !== 1
    //         || rawColor[2] !== 1 || rawColor[3] !== 1
    //         || rawColor[4] !== 0 || rawColor[5] !== 0
    //         || rawColor[6] !== 0 || rawColor[7] !== 0
    //     ) {
    //         multiColor = $multiplicationColor(color_transform, rawColor);
    //     }

    //     const alpha: number = $clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
    //     if (!alpha) {
    //         if (multiColor !== color_transform) {
    //             $poolFloat32Array8(multiColor);
    //         }
    //         return ;
    //     }

    //     const filters: FilterArrayImpl | null = this._$filters || this.filters;
    //     const blendMode: BlendModeImpl = this._$blendMode || this.blendMode;

    //     let multiMatrix: Float32Array = matrix;
    //     const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //     if (rawMatrix !== $MATRIX_HIT_ARRAY_IDENTITY
    //         && rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //         || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //         || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //     ) {
    //         multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //     }

    //     this
    //         ._$graphics
    //         ._$draw(context, multiMatrix, multiColor, blendMode, filters);

    //     if (multiMatrix !== matrix) {
    //         $poolFloat32Array6(multiMatrix);
    //     }

    //     if (multiColor !== color_transform) {
    //         $poolFloat32Array8(multiColor);
    //     }

    // }

    // /**
    //  * @param   {CanvasToWebGLContext} context
    //  * @param   {Float32Array} matrix
    //  * @returns {void}
    //  * @method
    //  * @private
    //  */
    // _$clip (
    //     context: CanvasToWebGLContext,
    //     matrix: Float32Array
    // ): void {

    //     if (!this._$graphics) {
    //         return ;
    //     }

    //     let multiMatrix: Float32Array = matrix;
    //     const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //     if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //         || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //         || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //     ) {
    //         multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //     }

    //     this._$graphics._$clip(context, multiMatrix);

    //     if (multiMatrix !== matrix) {
    //         $poolFloat32Array6(multiMatrix);
    //     }
    // }

    // /**
    //  * @param  {CanvasRenderingContext2D} context
    //  * @param  {Float32Array} matrix
    //  * @param  {object}  options
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$mouseHit (
    //     context: CanvasRenderingContext2D,
    //     matrix: Float32Array,
    //     options: PlayerHitObjectImpl
    // ): boolean {

    //     if (!this._$visible) {
    //         return false;
    //     }

    //     return this._$hit(context, matrix, options);
    // }

    // /**
    //  * @param  {CanvasRenderingContext2D} context
    //  * @param  {Float32Array} matrix
    //  * @param  {object}  options
    //  * @param  {boolean} [is_clip=false]
    //  * @return {boolean}
    //  * @method
    //  * @private
    //  */
    // _$hit (
    //     context: CanvasRenderingContext2D,
    //     matrix: Float32Array,
    //     options: PlayerHitObjectImpl,
    //     is_clip: boolean = false
    // ): boolean {

    //     let hit: boolean = false;

    //     const graphics: Graphics | null = this._$graphics;
    //     if (graphics
    //         && graphics._$canDraw
    //         && graphics._$getBounds()
    //     ) {

    //         let multiMatrix: Float32Array = matrix;
    //         const rawMatrix: Float32Array = this._$transform._$rawMatrix();
    //         if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
    //             || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
    //             || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
    //         ) {
    //             multiMatrix = $multiplicationMatrix(matrix, rawMatrix);
    //         }

    //         hit = graphics._$hit(
    //             context,
    //             multiMatrix,
    //             options,
    //             is_clip
    //         );

    //         if (multiMatrix !== matrix) {
    //             $poolFloat32Array6(multiMatrix);
    //         }

    //     }

    //     return hit;
    // }
}
