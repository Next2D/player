/**
 * @class
 */
class RenderDisplayObjectContainer extends RenderDisplayObject
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
         * @private
         */
        this._$children = [];

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$recodes = null;
    }

    /**
     * @param  {Float32Array} [matrix=null]
     * @param  {Float32Array} [color_transform=null]
     * @param  {string}       [blend_mode=null]
     * @param  {array}        [filters=null]
     * @param  {array}        [recodes=null]
     * @return {void}
     * @method
     * @public
     */
    update (
        matrix = null, color_transform = null,
        blend_mode = null, filters = null, recodes = null
    ) {

        super.update(matrix, color_transform, blend_mode, filters);

        if (recodes) {
            this._$recodes = recodes;
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
        const length = this._$children.length;
        for (let idx = 0; idx < length; ++idx) {
            this._$children[idx].remove();
        }

        // reset
        this._$children.length = 0;
        this._$recodes = null;

        super.remove();

        Util.$containers.push(this);
    }
}