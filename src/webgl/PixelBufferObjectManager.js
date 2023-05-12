/**
 * @class
 */
class PixelBufferObjectManager
{
    /**
     * @param {WebGLRenderingContext} gl
     * @constructor
     */
    constructor (gl)
    {
        this._$gl         = gl;
        this._$objectPool = [];
        this._$maxWidth   = 0;
        this._$maxHeight  = 0;
        this._$cacheSize  = 0;
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
                this._$cacheSize -= pixelBufferObject.size / 4;
                return pixelBufferObject;
            }
        }

        const pixelBufferObject = this._$objectPool.shift();
        this._$cacheSize -= pixelBufferObject.size / 4;

        return pixelBufferObject;
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
        const data = new Uint8Array(pixelBufferObject.size);

        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, pixelBufferObject);
        this._$gl.getBufferSubData(this._$gl.PIXEL_PACK_BUFFER, 0, data);
        this._$gl.bindBuffer(this._$gl.PIXEL_PACK_BUFFER, null);

        this.release(pixelBufferObject);

        return data;
    }

    /**
     * @param  {WebGLBuffer} pixelBufferObject
     * @return void
     * @public
     */
    release (pixelBufferObject)
    {
        if (pixelBufferObject.size > this._$maxWidth * this._$maxHeight * 4) {
            this._$gl.deleteBuffer(pixelBufferObject);
            return;
        }

        this._$objectPool.push(pixelBufferObject);
        this._$cacheSize += pixelBufferObject.size / 4;

        // プール容量が一定を超えたら、古いbufferから削除していく
        if (this._$cacheSize > this._$maxWidth * this._$maxHeight * 10) {
            const oldBufferObject = this._$objectPool.shift();
            this._$cacheSize -= oldBufferObject.size / 4;
            this._$gl.deleteBuffer(oldBufferObject);
        }
    }
}