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
     * @static
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

            if (character.bitmapId) {

                this._$bitmapId = character.bitmapId;

                const bitmap = loaderInfo._$data.characters[character.bitmapId];

                const width  = Util.$abs(bitmap.bounds.xMax - bitmap.bounds.xMin);
                const height = Util.$abs(bitmap.bounds.yMax - bitmap.bounds.yMin);

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
                        new Util.$Float32Array([1, 0, 0, 1, character.bounds.xMin, character.bounds.yMin]),
                        "repeat",
                        false
                    );
                }

            } else {

                graphics._$recode = character.recodes.slice(0);

            }

        } else {

            const width  = Util.$abs(character.bounds.xMax - character.bounds.xMin);
            const height = Util.$abs(character.bounds.yMax - character.bounds.yMin);

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

        const bounds = this._$graphics._$getBounds();
        if (matrix) {

            const tMatrix = Util.$multiplicationMatrix(
                matrix, this._$transform._$rawMatrix()
            );

            const result = Util.$boundsMatrix(bounds, tMatrix);
            Util.$poolBoundsObject(bounds);

            return result;
        }

        return bounds;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @private
     */
    _$draw (context, matrix, color_transform)
    {
        if (!this._$visible) {
            return ;
        }

        if (!this._$graphics || !this._$graphics._$canDraw) {
            return ;
        }

        let multiColor = color_transform;
        const rawColor = this._$transform._$rawColorTransform();
        if (rawColor !== Util.$COLOR_ARRAY_IDENTITY) {
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
        if (!this._$bitmapId) {

            let multiMatrix = matrix;
            const rawMatrix = this._$transform._$rawMatrix();
            if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
                multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
            }

            this
                ._$graphics
                ._$draw(context, multiMatrix, multiColor, blendMode, filters);

            if (multiMatrix !== matrix) {
                Util.$poolFloat32Array6(multiMatrix);
            }

        } else {

            this
                ._$graphics
                ._$drawBitmap(context, matrix, multiColor, blendMode, filters);

        }

        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }

    }

    /**
     * @param   {CanvasToWebGLContext} context
     * @param   {Float32Array} matrix
     * @returns {void}
     * @method
     * @private
     */
    _$clip (context, matrix)
    {
        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        this._$graphics._$clip(context, multiMatrix);

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
            if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
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