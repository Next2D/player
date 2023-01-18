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
class Shape extends DisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {Graphics}
         * @default null
         * @private
         */
        this._$graphics = null;

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$bounds = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$bitmapId = 0;
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
    static toString ()
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
    static get namespace ()
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
    toString ()
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
    get namespace ()
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
    get graphics ()
    {
        if (!this._$graphics) {
            this._$graphics = new Graphics(this);
        }
        return this._$graphics;
    }

    /**
     * @param  {object} character
     * @param  {LoaderInfo} loaderInfo
     * @return {void}
     * @method
     * @private
     */
    _$buildCharacter (character, loaderInfo)
    {
        const graphics = this.graphics;

        if (character.recodes) {

            switch (true) {

                case character.bitmapId > 0:
                    {
                        this._$bitmapId = character.bitmapId;

                        const bitmap = loaderInfo._$data.characters[character.bitmapId];

                        const width  = $Math.abs(bitmap.bounds.xMax - bitmap.bounds.xMin);
                        const height = $Math.abs(bitmap.bounds.yMax - bitmap.bounds.yMin);

                        const bitmapData = new BitmapData(width, height, true, 0);
                        if (!bitmap._$buffer) {
                            bitmap._$buffer = new Uint8Array(bitmap.buffer);
                            Util.$poolArray(bitmap.buffer);
                            bitmap.buffer = null;
                        }
                        bitmapData._$buffer = bitmap._$buffer.slice();

                        // setup
                        graphics._$recode = Util.$getArray();

                        // clone
                        const recodes = character.recodes;
                        if (recodes[recodes.length - 1] === Graphics.END_FILL) {

                            const length  = recodes.length - 6;
                            for (let idx = 0; idx < length; ++idx) {
                                graphics._$recode.push(recodes[idx]);
                            }

                            // add Bitmap Fill
                            graphics._$recode.push(
                                Graphics.BITMAP_FILL,
                                bitmapData,
                                null,
                                "repeat",
                                false
                            );

                        } else {

                            const width      = recodes[recodes.length - 9];
                            const caps       = recodes[recodes.length - 8];
                            const joints     = recodes[recodes.length - 7];
                            const miterLimit = recodes[recodes.length - 6];

                            const length  = recodes.length - 10;
                            for (let idx = 0; idx < length; ++idx) {
                                graphics._$recode.push(recodes[idx]);
                            }

                            graphics._$recode.push(
                                Graphics.BITMAP_STROKE,
                                width,
                                caps,
                                joints,
                                miterLimit,
                                bitmapData,
                                Util.$getFloat32Array6(
                                    1, 0, 0, 1, character.bounds.xMin, character.bounds.yMin
                                ),
                                "repeat",
                                false
                            );
                        }
                    }
                    break;

                case character.inBitmap:
                    {
                        // setup
                        graphics._$recode = Util.$getArray();

                        const recodes = character.recodes;
                        for (let idx = 0; idx < recodes.length; ++idx) {
                            const value = recodes[idx];
                            graphics._$recode[idx] = value;

                            if (typeof value !== "object") {
                                continue;
                            }

                            if (!value.buffer) {
                                continue;
                            }

                            const bitmapData = new BitmapData(
                                value.width, value.height, true, 0
                            );
                            bitmapData._$buffer = new Uint8Array(value.buffer);
                            graphics._$recode[idx++] = bitmapData;

                            const matrix = recodes[idx];
                            graphics._$recode[idx] = Util.$getFloat32Array6(
                                matrix[0], matrix[1], matrix[2],
                                matrix[3], matrix[4], matrix[5]
                            );
                        }
                    }
                    break;

                default:
                    graphics._$recode = character.recodes.slice(0);
                    break;

            }

        } else {

            const width  = $Math.abs(character.bounds.xMax - character.bounds.xMin);
            const height = $Math.abs(character.bounds.yMax - character.bounds.yMin);

            const bitmapData = new BitmapData(width, height, true, 0);
            if (!character._$buffer) {
                character._$buffer = new Uint8Array(character.buffer);
                Util.$poolArray(character.buffer);
                character.buffer = null;
            }
            bitmapData._$buffer = character._$buffer.slice(0);

            graphics
                .beginBitmapFill(bitmapData, null, false)
                .drawRect(0, 0, width, height);

        }

        graphics._$maxAlpha = 1;
        graphics._$canDraw  = true;

        graphics._$xMin = character.bounds.xMin;
        graphics._$xMax = character.bounds.xMax;
        graphics._$yMin = character.bounds.yMin;
        graphics._$yMax = character.bounds.yMax;

        // 9-scale
        if (character.grid) {
            this._$scale9Grid = new Rectangle(
                character.grid.x, character.grid.y,
                character.grid.w, character.grid.h
            );
        }
    }

    /**
     * @return {object}
     * @method
     * @private
     */
    _$sync ()
    {
        const character = super._$sync();

        if (character) {
            this._$buildCharacter(character, this._$loaderInfo);
        }

        return character;
    }

    /**
     * @param  {object} tag
     * @param  {DisplayObjectContainer} parent
     * @return {object}
     * @method
     * @private
     */
    _$build (tag, parent)
    {
        const character = super._$build(tag, parent);

        this._$buildCharacter(character, parent._$loaderInfo);

        return character;
    }

    /**
     * @param   {Float32Array} [matrix=null]
     * @returns {object}
     * @method
     * @private
     */
    _$getBounds (matrix = null)
    {
        if (!this._$graphics) {
            return Util.$getBoundsObject(0, 0, 0, 0);
        }

        const baseBounds = this._$graphics._$getBounds();
        if (!matrix) {
            return baseBounds;
        }

        let multiMatrix = matrix;

        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
        Util.$poolBoundsObject(baseBounds);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        return bounds;
    }

    /**
     * @param  {Renderer} renderer
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (renderer, matrix, color_transform)
    {
        if (!this._$visible) {
            return ;
        }

        if (!this._$graphics || !this._$graphics._$canDraw) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
        if (rawColor[0] !== 1 || rawColor[1] !== 1
            || rawColor[2] !== 1 || rawColor[3] !== 1
            || rawColor[4] !== 0 || rawColor[5] !== 0
            || rawColor[6] !== 0 || rawColor[7] !== 0
        ) {
            multiColor = Util.$multiplicationColor(color_transform, rawColor);
        }

        const alpha = Util.$clamp(multiColor[3] + multiColor[7] / 255, 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                Util.$poolFloat32Array8(multiColor);
            }
            return ;
        }

        const filters   = this._$filters   || this.filters;
        const blendMode = this._$blendMode || this.blendMode;

        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        this
            ._$graphics
            ._$draw(renderer, multiMatrix, multiColor, blendMode, filters);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }

    }

    /**
     * @param   {Renderer} renderer
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (renderer, matrix)
    {
        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
            || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
            || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
        ) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        this._$graphics._$clip(renderer, multiMatrix);

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @return {boolean}
     * @method
     * @private
     */
    _$mouseHit (context, matrix, options)
    {
        if (!this._$visible) {
            return false;
        }

        return this._$hit(context, matrix, options);
    }

    /**
     * @param  {CanvasRenderingContext2D} context
     * @param  {Float32Array} matrix
     * @param  {object}  options
     * @param  {boolean} [is_clip=false]
     * @return {boolean}
     * @method
     * @private
     */
    _$hit (context, matrix, options, is_clip)
    {
        let hit = false;

        if (this._$graphics
            && this._$graphics._$canDraw
            && this._$graphics._$getBounds()
        ) {

            let multiMatrix = matrix;
            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix[0] !== 1 || rawMatrix[1] !== 0
                || rawMatrix[2] !== 0 || rawMatrix[3] !== 1
                || rawMatrix[4] !== 0 || rawMatrix[5] !== 0
            ) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }

            hit = this
                ._$graphics
                ._$hit(context, multiMatrix, options, is_clip);

            if (multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }

        }

        return hit;
    }
}
