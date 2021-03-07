/**
 * @class
 */
class ColorBufferPool
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {number}                samples
     * @constructor
     */
    constructor (gl, samples)
    {
        this._$gl         = gl;
        this._$samples    = samples;
        this._$objectPool = [];
    }

    /**
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$createColorBuffer ()
    {
        const colorBuffer   = this._$gl.createRenderbuffer();
        colorBuffer.stencil = this._$gl.createRenderbuffer();
        colorBuffer.width   = 0;
        colorBuffer.height  = 0;
        colorBuffer.area    = 0;
        colorBuffer.dirty   = true;
        return colorBuffer;
    }

    /**
     * @param  {number} area
     * @return {WebGLRenderbuffer}
     * @private
     */
    _$getColorBuffer (area)
    {
        if (!this._$objectPool.length) {
            return this._$createColorBuffer();
        }

        const index = this._$bsearch(area);
        if (index < this._$objectPool.length) {
            const colorBuffer = this._$objectPool[index];
            this._$objectPool.splice(index, 1);
            return colorBuffer;
        }

        return this._$objectPool.shift();
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {uint}   [samples=0]
     * @return {WebGLRenderbuffer}
     * @public
     */
    create (width, height, samples = 0)
    {
        // 128以下で描画崩れが発生する場合がある？ため、256を最小サイズにする
        width  = Util.$max(256, Util.$upperPowerOfTwo(width));
        height = Util.$max(256, Util.$upperPowerOfTwo(height));

        const colorBuffer = this._$getColorBuffer(width * height);

        if (colorBuffer.width < width
            || colorBuffer.height < height
            || (samples && colorBuffer.samples !== samples)
        ) {
            width  = Util.$max(width,  colorBuffer.width);
            height = Util.$max(height, colorBuffer.height);

            colorBuffer.samples = samples || this._$samples;
            colorBuffer.width   = width;
            colorBuffer.height  = height;
            colorBuffer.area    = width * height;
            colorBuffer.dirty   = false;

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, colorBuffer);
            this._$gl.renderbufferStorageMultisample(
                this._$gl.RENDERBUFFER,
                samples || this._$samples,
                this._$gl.RGBA8,
                width, height
            );

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, colorBuffer.stencil);
            this._$gl.renderbufferStorageMultisample(
                this._$gl.RENDERBUFFER,
                samples || this._$samples,
                this._$gl.STENCIL_INDEX8,
                width, height
            );
        }

        return colorBuffer;
    }

    /**
     * @param  {WebGLRenderbuffer} colorBuffer
     * @return void
     * @public
     */
    release (colorBuffer)
    {
        colorBuffer.dirty = true;

        const index = this._$bsearch(colorBuffer.area);
        this._$objectPool.splice(index, 0, colorBuffer);
    }

    /**
     * @description 「めぐる式二分探索法」で面積が引数以上の要素のインデックスを求める
     * @param  {number} area
     * @return {number}
     * @private
     */
    _$bsearch (area)
    {
        let ng = -1;
        let ok = this._$objectPool.length;

        while (Util.$abs(ok - ng) > 1) {
            const mid = Util.$floor((ok + ng) / 2);
            if (area <= this._$objectPool[mid].area) {
                ok = mid;
            } else {
                ng = mid;
            }
        }

        return ok;
    }
}
