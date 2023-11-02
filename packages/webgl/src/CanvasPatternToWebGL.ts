/**
 * @class
 */
export class CanvasPatternToWebGL
{
    private readonly _$texture: WebGLTexture;
    private readonly _$repeat: boolean;
    private readonly _$colorTransform: Float32Array;

    /**
     * @constructor
     * @public
     */
    constructor (
        texture: WebGLTexture,
        repeat: boolean,
        color_transform: Float32Array
    ) {

        /**
         * @type {WebGLTexture}
         * @private
         */
        this._$texture = texture;

        /**
         * @type {string}
         * @private
         */
        this._$repeat = repeat;

        /**
         * @type {Float32Array}
         * @private
         */
        this._$colorTransform = color_transform;
    }

    /**
     * @member {WebGLTexture}
     * @readonly
     * @public
     */
    get texture (): WebGLTexture
    {
        return this._$texture;
    }

    /**
     * @member {boolean}
     * @readonly
     * @public
     */
    get repeat (): boolean
    {
        return this._$repeat;
    }

    /**
     * @member {Float32Array}
     * @readonly
     * @public
     */
    get colorTransform (): Float32Array
    {
        return this._$colorTransform;
    }
}