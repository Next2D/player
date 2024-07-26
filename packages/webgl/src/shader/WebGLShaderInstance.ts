/**
 * @class
 */
export class WebGLShaderInstance
{
    private readonly _$attributes: number[];
    private _$count: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {array}
         * @private
         */
        this._$attributes = [];

        /**
         * @type {number}
         * @private
         */
        this._$count = 0;
    }

    /**
     * @member {array}
     * @readonly
     * @public
     */
    get attributes (): number[]
    {
        return this._$attributes;
    }

    /**
     * @member {number}
     * @public
     */
    get count (): number
    {
        return this._$count;
    }
    set count (count: number)
    {
        this._$count = count;
    }

    /**
     * @method
     * @public
     */
    clear (): void
    {
        this._$attributes.length = 0;
        this._$count = 0;
    }

}