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
     * @param  {Float32Array} [matrix=null]
     * @param  {Float32Array} [color_transform=null]
     * @param  {string}       [blend_mode=null]
     * @param  {array}        [filters=null]
     * @param  {array}        [text_data=null]
     * @return {void}
     * @method
     * @public
     */
    update (
        matrix = null, color_transform = null,
        blend_mode = null, filters = null, text_data = null
    ) {

        super.update(matrix, color_transform, blend_mode, filters);

        if (text_data) {
            this._$textData = text_data;
        }
    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @return {void}
     * @method
     * @public
     */
    clip (context, matrix)
    {

    }

    /**
     * @param  {CanvasToWebGLContext} context
     * @param  {Float32Array} matrix
     * @param  {Float32Array} color_transform
     * @return {void}
     * @method
     * @public
     */
    draw (context, matrix, color_transform)
    {

    }

    /**
     * @description Playerから登録を削除
     *
     * @return {void}
     * @method
     * @public
     */
    remove ()
    {
        this._$xMin     = 0;
        this._$yMin     = 0;
        this._$xMax     = 0;
        this._$yMax     = 0;
        this._$textData = null;

        super.remove();

        Util.$textFields.push(this);
    }
}