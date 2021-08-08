/**
 * @class
 */
class PixelBufferObjectManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {boolean}               isWebGL2Context
     * @constructor
     */
    constructor (gl, isWebGL2Context)
    {
        this._$gl              = gl;
        this._$isWebGL2Context = isWebGL2Context;
        this._$objectPool      = [];
    }

    /**
     * @param  {number} size
     * @return {WebGLBuffer}
     * @private
     */
    _$getPixelBufferObject (size)
    {
        if (!this._$objectPool.length) {
            const pixelBufferObject = this._$gl.createBuffer();
            pixelBufferObject.size  = 0;
            return pixelBufferObject;
        }

        for (let i = 0; i < this._$objectPool.length; i++) {
            const pixelBufferObject = this._$objectPool[i];
            if (pixelBufferObject.size === size) {
                this._$objectPool.splice(i, 1);
                return pixelBufferObject;
            }
        }

        return this._$objectPool.shift();
    }

    /**
     * @param  {number} x
     * @param  {number} y
     * @param  {number} width
     * @param  {number} height
     * @return {WebGLBuffer}
     * @public
     */
    readPixelsAsync (x, y, width, height)
    {
        if (!this._$isWebGL2Context) {
            return null;
        }

        const size              = width * height * 4;
        const pixelBufferObject = this._$getPixelBufferObject(size);

        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, pixelBufferObject);

        if (pixelBufferObject.size !== size) {
            pixelBufferObject.size = size;
            this._$gl.bufferData(this._$gl.PIXEL_PACK_BUFFER, size, this._$gl.DYNAMIC_COPY);
        }

        this._$gl.readPixels(
            x, y, width, height,
            this._$gl.RGBA, this._$gl.UNSIGNED_BYTE,
            0
        );
        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, null);

        return pixelBufferObject;
    }

    /**
     * @param  {WebGLBuffer} pixelBufferObject
     * @return {Uint8Array}
     * @public
     */
    getBufferSubDataAsync (pixelBufferObject)
    {
        const data = Util.$getUint8Array(pixelBufferObject.size);

        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, pixelBufferObject);
        this._$gl.getBufferSubData(this._$gl.PIXEL_PACK_BUFFER, 0, data);
        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, null);

        this._$objectPool.push(pixelBufferObject);

        return data;
    }

    /**
     * @param  {WebGLBuffer} pixelBufferObject
     * @return void
     * @public
     */
    release (pixelBufferObject)
    {
        this._$objectPool.push(pixelBufferObject);
    }
}