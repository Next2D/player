import { CanvasToWebGLContext } from "./CanvasToWebGLContext";

/**
 * @class
 */
export class CanvasPatternToWebGL
{
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$texture: WebGLTexture;
    private readonly _$repeat: string;
    private readonly _$colorTransform: Float32Array;

    /**
     * @constructor
     * @public
     */
    constructor (
        context: CanvasToWebGLContext,
        texture: WebGLTexture,
        repeat: string,
        color_transform: Float32Array
    ) {

        /**
         * @type {CanvasToWebGLContext}
         * @private
         */
        this._$context = context;

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
     * @return {void}
     * @method
     * @private
     */
    dispose (): void
    {
        this
            ._$context
            .frameBuffer
            .releaseTexture(this._$texture);
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
     * @member {string}
     * @readonly
     * @public
     */
    get repeat (): string
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