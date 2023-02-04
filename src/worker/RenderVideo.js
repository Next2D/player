/**
 * @class
 */
class RenderVideo extends RenderDisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {ImageBitmap}
         * @default null
         * @private
         */
        this._$imageBitmap = null;

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
     * @param  {ImageBitmap}  [image_bitmap=null]
     * @return {void}
     * @method
     * @public
     */
    update (
        matrix = null, color_transform = null,
        blend_mode = null, filters = null, image_bitmap = null
    ) {

        super.update(matrix, color_transform, blend_mode, filters);

        if (image_bitmap) {
            this._$imageBitmap = image_bitmap;
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
        this._$xMin        = 0;
        this._$yMin        = 0;
        this._$xMax        = 0;
        this._$yMax        = 0;
        this._$imageBitmap = null;

        super.remove();

        Util.$videos.push(this);
    }
}