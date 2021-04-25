/**
 * @class
 * @memberOf next2d.display
 * @extends  DisplayObject
 */
class Shape extends DisplayObject
{
    /**
     * Shape クラスには、Graphics クラスからメソッドにアクセスできる graphics プロパティがあります。
     *
     * The Shape class includes a graphics property,
     * which lets you access methods from the Graphics class.
     *
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {Graphics|null}
         * @default null
         * @private
         */
        this._$graphics = null;

        /**
         * @type {object|null}
         * @default null
         * @private
         */
        this._$bounds = null;
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
    static toString()
    {
        return "[class Shape]";
    }

    /**
     * @description 指定されたクラスの空間名を返します。
     *              Returns the space name of the specified class.
     *
     * @return  {string}
     * @default next2d.display:Shape
     * @const
     * @static
     */
    static get namespace ()
    {
        return "next2d.display:Shape";
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
     * @default next2d.display:Shape
     * @const
     * @static
     */
    get namespace ()
    {
        return "next2d.display:Shape";
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
     * @param  {object}    tag
     * @param  {object}    character
     * @param  {MovieClip} parent
     * @return {Shape}
     * @method
     * @private
     */
    _$build (tag, character, parent)
    {

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

        const bounds = this._$graphics._$getBounds(matrix);
        if (!bounds) {
            Util.$poolBoundsObject(bounds);
            return Util.$getBoundsObject(0, 0, 0, 0);
        }

        if (matrix) {

            const tMatrix = Util.$multiplicationMatrix(
                matrix, this._$transform._$rawMatrix()
            );

            const result = Util.$boundsMatrix(bounds, tMatrix);
            Util.$poolBoundsObject(bounds);

            return result;
        }

        const result = Util.$getBoundsObject(
            bounds.xMin, bounds.xMax,
            bounds.yMin, bounds.yMax
        );
        Util.$poolBoundsObject(bounds);

        return result;
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

        const alpha = Util.$clamp(multiColor[3] + (multiColor[7] / 255), 0, 1, 0);
        if (!alpha) {
            if (multiColor !== color_transform) {
                Util.$poolFloat32Array8(multiColor);
            }
            return ;
        }


        let multiMatrix = matrix;
        const rawMatrix = this._$transform._$rawMatrix();
        if (rawMatrix !== Util.$MATRIX_ARRAY_IDENTITY) {
            multiMatrix = Util.$multiplicationMatrix(matrix, rawMatrix);
        }

        const filters   = this._$filters   || this.filters;
        const blendMode = this._$blendMode || this.blendMode;

        this
            ._$graphics
            ._$draw(context, multiMatrix, multiColor, blendMode, filters);


        if (multiColor !== color_transform) {
            Util.$poolFloat32Array8(multiColor);
        }

        if (multiMatrix !== matrix) {
            Util.$poolFloat32Array6(multiMatrix);
        }
    }

}