/**
 * @class
 */
class RenderDisplayObject
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$instanceId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$loaderInfoId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$characterId = -1;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$updated = true;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$matrix = null;

        /**
         * @type {Float32Array}
         * @default null
         * @private
         */
        this._$colorTransform = null;

        /**
         * @type {string}
         * @default BlendMode.NORMAL
         * @private
         */
        this._$blendMode = BlendMode.NORMAL;

        /**
         * @type {array}
         * @default null
         * @private
         */
        this._$filters = null;
    }

    /**
     * @description 描画情報を更新
     *
     * @param  {Float32Array} [matrix=null]
     * @param  {Float32Array} [color_transform=null]
     * @param  {string}       [blend_mode=null]
     * @param  {array}        [filters=null]
     * @return {void}
     * @method
     * @public
     */
    update (
        matrix = null, color_transform = null,
        blend_mode = null, filters = null
    ) {
        this._$matrix         = matrix;
        this._$colorTransform = color_transform;
        this._$blendMode      = blend_mode || BlendMode.NORMAL;
        this._$filters        = filters;
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
        Util
            .$renderPlayer
            ._$instances
            .delete(this._$instanceId);

        // reset
        this._$instanceId     = -1;
        this._$loaderInfoId   = -1;
        this._$characterId    = -1;
        this._$updated        = true;
        this._$matrix         = null;
        this._$colorTransform = null;
        this._$blendMode      = BlendMode.NORMAL;
        this._$filters        = null;
    }
}