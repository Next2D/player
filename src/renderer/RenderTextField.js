/**
 * @class
 */
class RenderTextField extends RenderDisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$textData = null;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$xMin = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$yMin = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$xMax = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$yMax = 0;
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @private
     */
    _$clip (context, matrix)
    {
        console.log(context, matrix);
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
        console.log(context, matrix, color_transform);
    }

    /**
     * @description Playerから登録を削除
     *
     * @return {void}
     * @method
     * @private
     */
    _$remove ()
    {
        this._$xMin     = 0;
        this._$yMin     = 0;
        this._$xMax     = 0;
        this._$yMax     = 0;
        this._$textData = null;

        super._$remove();

        Util.$textFields.push(this);
    }
}