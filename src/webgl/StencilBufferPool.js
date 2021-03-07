/**
 * @class
 */
class StencilBufferPool
{
    /**
     * @param {WebGLRenderingContext} gl
     * @constructor
     */
    constructor (gl)
    {
        this._$gl             = gl;
        this._$objectPool     = [];
        this._$objectPoolArea = 0;
        this._$maxWidth       = 0;
        this._$maxHeight      = 0;
    }

    /**
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$createStencilBuffer ()
    {
        const stencilBuffer  = this._$gl.createRenderbuffer();
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
     * @private
     */
    _$getStencilBuffer (width, height)
    {
        const length = this._$objectPool.length;
        for (let i = 0; i < length; i++) {
            const stencilBuffer = this._$objectPool[i];
            if (stencilBuffer.width === width && stencilBuffer.height === height) {
                this._$objectPool.splice(i, 1);
                this._$objectPoolArea -= stencilBuffer.area;
                return stencilBuffer;
            }
        }

        if (length > 100) {
            const stencilBuffer = this._$objectPool.shift();
            this._$objectPoolArea -= stencilBuffer.area;
            return stencilBuffer;
        }

        return this._$createStencilBuffer();
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @return {WebGLRenderbuffer}
     * @public
     */
    create (width, height)
    {
        const stencilBuffer = this._$getStencilBuffer(width, height);

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
     * @return void
     * @public
     */
    release (stencilBuffer)
    {
        // ステンシルバッファのサイズが非常に大きい場合はプールしない
        if (stencilBuffer.area > (this._$maxWidth * this._$maxHeight * 1.2)|0) {
            this._$gl.deleteRenderbuffer(stencilBuffer);
            return;
        }

        stencilBuffer.dirty = true;
        this._$objectPool.push(stencilBuffer);
        this._$objectPoolArea += stencilBuffer.area;


        // プール容量が一定を超えたら、古いステンシルバッファから削除していく
        if (this._$objectPoolArea > (this._$maxWidth * this._$maxHeight * 10)) {
            const oldStencilBuffer = this._$objectPool.shift();
            this._$objectPoolArea -= oldStencilBuffer.area;
            this._$gl.deleteRenderbuffer(oldStencilBuffer);
        }
    }
}
