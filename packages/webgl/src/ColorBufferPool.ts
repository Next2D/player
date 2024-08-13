import type { IColorBufferObject } from "./interface/IColorBufferObject";
import {
    $getArray,
    $upperPowerOfTwo
} from "./WebGLUtil";

/**
 * @class
 */
export class ColorBufferPool
{
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$objectPool: WebGLRenderbuffer[];
    private _$samples: number;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number}                samples
     * @constructor
     */
    constructor (gl: WebGL2RenderingContext, samples: number)
    {
        this._$gl         = gl;
        this._$samples    = samples;
        this._$objectPool = $getArray();
    }

    /**
     * @member {number}
     * @param {number} samples
     * @public
     */
    set samples (samples: number)
    {
        this._$samples = samples;
    }

    /**
     * @return {WebGLRenderbuffer}
     * @method
     * @private
     */
    _$createColorBuffer (): WebGLRenderbuffer
    {
        const colorBuffer: WebGLRenderbuffer | null = this._$gl.createRenderbuffer();
        if (!colorBuffer) {
            throw new Error("the color buffer is null.");
        }

        const stencilBuffer: WebGLRenderbuffer | null = this._$gl.createRenderbuffer();
        if (!stencilBuffer) {
            throw new Error("the stencil buffer is null.");
        }

        colorBuffer.stencil = stencilBuffer;
        colorBuffer.samples = 0;
        colorBuffer.width   = 0;
        colorBuffer.height  = 0;
        colorBuffer.area    = 0;
        colorBuffer.dirty   = true;

        return colorBuffer;
    }

    /**
     * @param  {number} area
     * @return {WebGLRenderbuffer}
     * @method
     * @private
     */
    _$getColorBuffer (area: number): WebGLRenderbuffer
    {
        if (!this._$objectPool.length) {
            return this._$createColorBuffer();
        }

        const index: number = this._$bsearch(area);
        if (index < this._$objectPool.length) {
            const colorBuffer: WebGLRenderbuffer = this._$objectPool[index];
            this._$objectPool.splice(index, 1);
            return colorBuffer;
        }

        const colorBuffer: WebGLRenderbuffer | void = this._$objectPool.shift();
        if (!colorBuffer) {
            throw new Error("the color buffer is void.");
        }

        return colorBuffer;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @param  {number} [samples=0]
     * @return {WebGLRenderbuffer}
     * @method
     * @public
     */
    create (
        width: number, height: number,
        samples: number = 0
    ): WebGLRenderbuffer {

        // 128以下で描画崩れが発生する場合がある？ため、256を最小サイズにする
        width  = Math.max(256, $upperPowerOfTwo(width));
        height = Math.max(256, $upperPowerOfTwo(height));

        const colorBuffer: WebGLRenderbuffer = this._$getColorBuffer(width * height);

        if (!samples) {
            samples = this._$samples;
        }

        if (colorBuffer.width < width
            || colorBuffer.height < height
            || colorBuffer.samples !== samples
        ) {

            width  = Math.max(width,  colorBuffer.width);
            height = Math.max(height, colorBuffer.height);

            colorBuffer.samples = samples;
            colorBuffer.width   = width;
            colorBuffer.height  = height;
            colorBuffer.area    = width * height;
            colorBuffer.dirty   = false;

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, colorBuffer);
            this._$gl.renderbufferStorageMultisample(
                this._$gl.RENDERBUFFER,
                samples,
                this._$gl.RGBA8,
                width, height
            );

            this._$gl.bindRenderbuffer(this._$gl.RENDERBUFFER, colorBuffer.stencil);
            this._$gl.renderbufferStorageMultisample(
                this._$gl.RENDERBUFFER,
                samples,
                this._$gl.STENCIL_INDEX8,
                width, height
            );
        }

        return colorBuffer;
    }

    /**
     * @param  {WebGLRenderbuffer} [colorBuffer = null]
     * @return {void}
     * @method
     * @public
     */
    release (colorBuffer: WebGLRenderbuffer): void
    {
        colorBuffer.dirty = true;

        const index: number = this._$bsearch(colorBuffer.area);
        this._$objectPool.splice(index, 0, colorBuffer);
    }

    /**
     * @description 「めぐる式二分探索法」で面積が引数以上の要素のインデックスを求める
     *
     * @param  {number} area
     * @return {number}
     * @method
     * @private
     */
    _$bsearch (area: number): number
    {
        let ng: number = -1;
        let ok: number = this._$objectPool.length;

        while (Math.abs(ok - ng) > 1) {
            const mid: number = Math.floor((ok + ng) / 2);
            if (area <= this._$objectPool[mid].area) {
                ok = mid;
            } else {
                ng = mid;
            }
        }

        return ok;
    }
}