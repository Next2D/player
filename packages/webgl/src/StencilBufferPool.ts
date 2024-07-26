/**
 * @class
 */
export class StencilBufferPool
{
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$objectPool: WebGLRenderbuffer[];
    private _$objectPoolArea: number;
    public _$maxWidth: number;
    public _$maxHeight: number;

    /**
     * @param {WebGL2RenderingContext} gl
     * @constructor
     */
    constructor (gl: WebGL2RenderingContext)
    {
        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {array}
         * @private
         */
        this._$objectPool = [];

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$objectPoolArea = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxWidth = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$maxHeight = 0;
    }

    /**
     * @member {number}
     * @param {number} max_width
     * @public
     */
    set maxWidth (max_width: number)
    {
        this._$maxWidth = max_width;
    }

    /**
     * @member {number}
     * @param {number} max_height
     * @public
     */
    set maxHeight (max_height: number)
    {
        this._$maxHeight = max_height;
    }

    /**
     * @return {WebGLRenderbuffer}
     * @method
     * @private
     */
    _$createStencilBuffer (): WebGLRenderbuffer
    {
        const stencilBuffer: WebGLRenderbuffer|null  = this._$gl.createRenderbuffer();
        if (!stencilBuffer) {
            throw new Error("the stencil buffer is null.");
        }

        stencilBuffer.width  = 0;
        stencilBuffer.height = 0;
        stencilBuffer.area   = 0;
        stencilBuffer.dirty  = true;

        return stencilBuffer;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @return {WebGLRenderbuffer}
     * @method
     * @private
     */
    _$getStencilBuffer (width: number, height: number): WebGLRenderbuffer
    {
        const length: number = this._$objectPool.length;
        for (let idx: number = 0; idx < length; ++idx) {

            const stencilBuffer: WebGLRenderbuffer = this._$objectPool[idx];
            if (stencilBuffer.width === width
                && stencilBuffer.height === height
            ) {
                this._$objectPool.splice(idx, 1);
                this._$objectPoolArea -= stencilBuffer.area;
                return stencilBuffer;
            }
        }

        if (length > 100) {
            const stencilBuffer: WebGLRenderbuffer | void = this._$objectPool.shift();
            if (stencilBuffer) {
                this._$objectPoolArea -= stencilBuffer.area;
                return stencilBuffer;
            }
        }

        return this._$createStencilBuffer();
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @return {WebGLRenderbuffer}
     * @method
     * @public
     */
    create (width: number, height: number): WebGLRenderbuffer
    {
        const stencilBuffer: WebGLRenderbuffer = this._$getStencilBuffer(width, height);

        if (stencilBuffer.width !== width || stencilBuffer.height !== height) {
            stencilBuffer.width  = width;
            stencilBuffer.height = height;
            stencilBuffer.area   = width * height;
            stencilBuffer.dirty  = false;

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, stencilBuffer);
            this._$gl.renderbufferStorage(
                this._$gl.RENDERBUFFER,
                this._$gl.STENCIL_INDEX8,
                width, height
            );
        }

        return stencilBuffer;
    }

    /**
     * @param  {WebGLRenderbuffer} stencilBuffer
     * @return {void}
     * @method
     * @public
     */
    release (stencilBuffer: WebGLRenderbuffer): void
    {
        // ステンシルバッファのサイズが非常に大きい場合はプールしない
        if (stencilBuffer.area > this._$maxWidth * this._$maxHeight * 2) {
            this._$gl.deleteRenderbuffer(stencilBuffer);
            return;
        }

        stencilBuffer.dirty = true;
        this._$objectPool.push(stencilBuffer);
        this._$objectPoolArea += stencilBuffer.area;

        // プール容量が一定を超えたら、古いステンシルバッファから削除していく
        if (this._$objectPoolArea > this._$maxWidth * this._$maxHeight * 10) {
            const oldStencilBuffer: WebGLRenderbuffer | void = this._$objectPool.shift();
            if (oldStencilBuffer) {
                this._$objectPoolArea -= oldStencilBuffer.area;
                this._$gl.deleteRenderbuffer(oldStencilBuffer);
            }
        }
    }
}