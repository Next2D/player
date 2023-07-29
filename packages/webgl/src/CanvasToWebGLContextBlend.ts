import type { CanvasToWebGLContext } from "./CanvasToWebGLContext";
import type { FrameBufferManager } from "./FrameBufferManager";
import type { CanvasToWebGLShader } from "./shader/CanvasToWebGLShader";
import type { WebGLShaderUniform } from "./shader/WebGLShaderUniform";
import type { WebGLShaderInstance } from "./shader/WebGLShaderInstance";
import type { BlendShaderVariantCollection } from "./shader/variants/BlendShaderVariantCollection";
import type { BlendModeImpl } from "./interface/BlendModeImpl";
import type { AttachmentImpl } from "./interface/AttachmentImpl";
import type { CachePositionImpl } from "./interface/CachePositionImpl";
import {
    $Math,
    $Number,
    $inverseMatrix
} from "@next2d/share";

/**
 * @class
 */
export class CanvasToWebGLContextBlend
{
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$gl: WebGL2RenderingContext;
    private _$enabled: boolean;
    private _$funcCode: number;
    private _$currentShader: CanvasToWebGLShader | null;
    private _$currentOperation: BlendModeImpl;
    private _$currentIndex: number;
    private _$currentSmoothing: boolean | null;

    /**
     * @param {CanvasToWebGLContext} context
     * @param {WebGL2RenderingContext} gl
     * @constructor
     * @public
     */
    constructor (context: CanvasToWebGLContext, gl: WebGL2RenderingContext)
    {
        /**
         * @type {CanvasToWebGLContext}
         * @private
         */
        this._$context = context;

        /**
         * @type {WebGL2RenderingContext}
         * @private
         */
        this._$gl = gl;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$enabled = false;

        /**
         * @type {number}
         * @default 600
         * @private
         */
        this._$funcCode = 600;

        /**
         * @type {CanvasToWebGLShader}
         * @default null
         * @private
         */
        this._$currentShader = null;

        /**
         * @type {string}
         * @private
         */
        this._$currentOperation = "normal";

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$currentIndex = -1;

        /**
         * @type {boolean}
         * @default null
         * @private
         */
        this._$currentSmoothing = null;

        // start
        this.enable();
    }

    /**
     * @member {CanvasToWebGLShader | null}
     * @readonly
     * @public
     */
    get currentShader (): CanvasToWebGLShader | null
    {
        return this._$currentShader;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    enable (): void
    {
        if (!this._$enabled) {
            this._$enabled = true;
            this._$gl.enable(this._$gl.BLEND);
        }

        this.reset();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    disable (): void
    {
        if (this._$enabled) {
            this._$enabled = false;
            this._$gl.disable(this._$gl.BLEND);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset (): void
    {
        if (this._$funcCode !== 613) {
            this._$funcCode = 613;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toOneZero (): void
    {
        if (this._$funcCode !== 610) {
            this._$funcCode = 610;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ZERO);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toZeroOne (): void
    {
        if (this._$funcCode !== 601) {
            this._$funcCode = 601;
            this._$gl.blendFuncSeparate(
                this._$gl.ZERO, this._$gl.ONE,
                this._$gl.ONE, this._$gl.ZERO
            );
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toAdd (): void
    {
        if (this._$funcCode !== 611) {
            this._$funcCode = 611;
            this._$gl.blendFunc(this._$gl.ONE, this._$gl.ONE);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toScreen (): void
    {
        if (this._$funcCode !== 641) {
            this._$funcCode = 641;
            this._$gl.blendFunc(this._$gl.ONE_MINUS_DST_COLOR, this._$gl.ONE);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toAlpha (): void
    {
        if (this._$funcCode !== 606) {
            this._$funcCode = 606;
            this._$gl.blendFunc(this._$gl.ZERO, this._$gl.SRC_ALPHA);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toErase (): void
    {
        if (this._$funcCode !== 603) {
            this._$funcCode = 603;
            this._$gl.blendFunc(this._$gl.ZERO, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toSourceAtop (): void
    {
        if (this._$funcCode !== 673) {
            this._$funcCode = 673;
            this._$gl.blendFunc(this._$gl.DST_ALPHA, this._$gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    toSourceIn (): void
    {
        if (this._$funcCode !== 670) {
            this._$funcCode = 670;
            this._$gl.blendFunc(this._$gl.DST_ALPHA, this._$gl.ZERO);
        }
    }

    /**
     * @param  {string} operation
     * @return {void}
     * @method
     * @public
     */
    toOperation (operation: BlendModeImpl): void
    {
        switch (operation) {

            case "add":
                this.toAdd();
                break;

            case "screen":
                this.toScreen();
                break;

            case "alpha":
                this.toAlpha();
                break;

            case "erase":
                this.toErase();
                break;

            case "copy":
                this.toOneZero();
                break;

            default:
                this.reset();
                break;

        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clearInstacedArray (): void
    {
        if (!this._$currentShader) {
            return ;
        }

        const instance: WebGLShaderInstance = this._$currentShader.instance;
        if (!instance.count) {
            return ;
        }

        instance.clear();
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    drawInstacedArray (): void
    {
        if (!this._$currentShader) {
            return ;
        }

        const instance: WebGLShaderInstance = this._$currentShader.instance;
        if (!instance.count) {
            return ;
        }

        const manager: FrameBufferManager = this._$context.frameBuffer;
        const texture: WebGLTexture = manager
            .textureManager
            .getAtlasTexture(this._$currentIndex);

        manager
            .textureManager
            .bind0(texture, this._$currentSmoothing);

        this.toOperation(this._$currentOperation);
        this
            ._$currentShader
            .drawArraysInstanced(instance);

        instance.clear();
    }

    /**
     * @param  {object} position
     * @param  {number} ct0
     * @param  {number} ct1
     * @param  {number} ct2
     * @param  {number} ct3
     * @param  {number} ct4
     * @param  {number} ct5
     * @param  {number} ct6
     * @param  {number} ct7
     * @param  {string} operation
     * @param  {number} render_width
     * @param  {number} render_height
     * @param  {Float32Array} matrix
     * @param  {boolean} smoothing
     * @return {void}
     * @method
     * @public
     */
    drawInstance (
        position: CachePositionImpl,
        ct0: number, ct1: number, ct2: number, ct3: number,
        ct4: number, ct5: number, ct6: number, ct7: number,
        operation: BlendModeImpl,
        render_width: number, render_height: number,
        matrix: Float32Array, smoothing: boolean
    ): void {

        const withCT: boolean =
            ct0 !== 1 || ct1 !== 1 || ct2 !== 1 || ct3 !== 1 ||
            ct4 !== 0 || ct5 !== 0 || ct6 !== 0 || ct7 !== 0
        ;

        const variants: BlendShaderVariantCollection = this
            ._$context
            .shaderList
            .blendShaderVariants;

        if (!this._$currentOperation) {
            this._$currentOperation = operation;
        }

        const shader: CanvasToWebGLShader = variants.getInstanceShader(withCT);
        if (!this._$currentShader) {
            this._$currentShader = shader;
        }

        if (this._$currentIndex === -1) {
            this._$currentIndex = position.index;
        }

        if (this._$currentSmoothing === null) {
            this._$currentSmoothing = smoothing;
        }

        if (this._$currentShader !== shader
            || this._$currentOperation !== operation
            || this._$currentIndex !== position.index
            || this._$currentSmoothing !== smoothing
        ) {

            // execute
            this.drawInstacedArray();

            // update
            this._$currentShader    = shader;
            this._$currentOperation = operation;
            this._$currentIndex     = position.index;
            this._$currentSmoothing = smoothing;
        }

        variants.pushNormalBlend(
            shader.instance,
            position.x, position.y, position.w, position.h,
            matrix, render_width, render_height,
            withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
        );
    }

    /**
     * @param {WebGLTexture} atlas_texture
     * @param {number} x_min
     * @param {number} y_min
     * @param {number} x_max
     * @param {number} y_max
     * @param {number} ct0
     * @param {number} ct1
     * @param {number} ct2
     * @param {number} ct3
     * @param {number} ct4
     * @param {number} ct5
     * @param {number} ct6
     * @param {number} ct7
     * @param {object} cache_position
     * @param {string} operation
     * @param {number} render_width
     * @param {number} render_height
     * @param {Float32Array} matrix
     * @param {boolean} smoothing
     */
    drawInstanceBlend (
        atlas_texture: WebGLTexture,
        x_min: number, y_min: number, x_max: number, y_max: number,
        ct0: number, ct1: number, ct2: number, ct3: number,
        ct4: number, ct5: number, ct6: number, ct7: number,
        cache_position: CachePositionImpl,
        operation: BlendModeImpl,
        render_width: number, render_height: number,
        matrix: Float32Array, smoothing: boolean
    ): void {

        const manager: FrameBufferManager = this._$context.frameBuffer;
        const currentAttachment: AttachmentImpl | null = manager.currentAttachment;

        const withCT: boolean =
            ct0 !== 1 || ct1 !== 1 || ct2 !== 1 || ct3 !== 1 ||
            ct4 !== 0 || ct5 !== 0 || ct6 !== 0 || ct7 !== 0
        ;

        const variants: BlendShaderVariantCollection = this
            ._$context
            .shaderList
            .blendShaderVariants;

        const texture: WebGLTexture = manager
            .getTextureFromCurrentAttachment();

        const backTextureAttachment: AttachmentImpl = this
            ._$context
            .frameBuffer
            .createTextureAttachment(cache_position.w, cache_position.h);

        this
            ._$context
            ._$bind(backTextureAttachment);

        manager
            .textureManager
            .bind0(texture);

        const clipShader: CanvasToWebGLShader = variants.getClipShader();
        const clipUniform: WebGLShaderUniform = clipShader.uniform;
        variants.setClipUniform(
            clipUniform, 0, 0, cache_position.w, cache_position.h,
            $inverseMatrix(matrix), render_width, render_height
        );

        this.reset();
        clipShader._$drawImage();

        const backTexture = manager
            .getTextureFromCurrentAttachment();

        this._$context._$bind(currentAttachment);

        manager
            .textureManager
            .bind01(backTexture, atlas_texture, smoothing);

        const shader: CanvasToWebGLShader = variants
            .getInstanceBlendShader(operation, withCT);

        variants.setInstanceBlendUniform(
            shader.uniform,
            cache_position.x / atlas_texture.width,
            cache_position.y / atlas_texture.height,
            cache_position.w / atlas_texture.width,
            cache_position.h / atlas_texture.height,
            cache_position.w, cache_position.h,
            matrix, render_width, render_height,
            withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
        );

        const width: number  = $Math.abs(x_max - x_min);
        const height: number = $Math.abs(y_max - y_min);
        this._$gl.enable(this._$gl.SCISSOR_TEST);
        this._$gl.scissor(x_min, render_height - (y_min + height), width, height);

        this.toOneZero();
        shader._$drawImage();

        this._$gl.disable(this._$gl.SCISSOR_TEST);

        manager.releaseAttachment(backTextureAttachment, true);
    }

    /**
     * @param  {WebGLTexture} image
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {number} ct0
     * @param  {number} ct1
     * @param  {number} ct2
     * @param  {number} ct3
     * @param  {number} ct4
     * @param  {number} ct5
     * @param  {number} ct6
     * @param  {number} ct7
     * @param  {string} operation
     * @param  {number} renderWidth
     * @param  {number} renderHeight
     * @param  {Float32Array} matrix
     * @param  {boolean} imageSmoothingEnabled
     * @return {void}
     * @method
     * @public
     */
    drawImage (
        image: WebGLTexture,
        x: number, y: number, w: number, h: number,
        ct0: number, ct1: number, ct2: number, ct3: number,
        ct4: number, ct5: number, ct6: number, ct7: number,
        operation: BlendModeImpl,
        renderWidth: number, renderHeight: number,
        matrix: Float32Array,
        imageSmoothingEnabled: boolean
    ): void {

        const manager: FrameBufferManager = this._$context.frameBuffer;
        const currentBuffer: AttachmentImpl | null = manager.currentAttachment;

        const withCT: boolean =
            ct0 !== 1 || ct1 !== 1 || ct2 !== 1 || ct3 !== 1 ||
            ct4 !== 0 || ct5 !== 0 || ct6 !== 0 || ct7 !== 0
        ;

        const variants: BlendShaderVariantCollection = this
            ._$context
            .shaderList
            .blendShaderVariants;

        switch (operation) {

            case "normal":
            case "layer":
            case "add":
            case "screen":
            case "alpha":
            case "erase":
            case "copy":
                {
                    manager.textureManager.bind0(image, imageSmoothingEnabled);

                    const shader: CanvasToWebGLShader = variants.getNormalBlendShader(withCT);
                    variants.setNormalBlendUniform(
                        shader.uniform, x, y, w, h, matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    const a: number  = matrix[0];
                    const b: number  = matrix[1];
                    const c: number  = matrix[3];
                    const d: number  = matrix[4];
                    const tx: number = matrix[6];
                    const ty: number = matrix[7];

                    if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {

                        const left: number   = x;
                        const right: number  = x + w;
                        const top: number    = y;
                        const bottom: number = y + h;

                        const x0: number = +(right * a + bottom * c + tx);
                        const x1: number = +(right * a + top    * c + tx);
                        const x2: number = +(left  * a + bottom * c + tx);
                        const x3: number = +(left  * a + top    * c + tx);
                        const y0: number = +(right * b + bottom * d + ty);
                        const y1: number = +(right * b + top    * d + ty);
                        const y2: number = +(left  * b + bottom * d + ty);
                        const y3: number = +(left  * b + top    * d + ty);

                        const no: number = $Number.MAX_VALUE;
                        const xMin: number = +$Math.min($Math.min($Math.min($Math.min( no, x0), x1), x2), x3);
                        const xMax: number = +$Math.max($Math.max($Math.max($Math.max(-no, x0), x1), x2), x3);
                        const yMin: number = +$Math.min($Math.min($Math.min($Math.min( no, y0), y1), y2), y3);
                        const yMax: number = +$Math.max($Math.max($Math.max($Math.max(-no, y0), y1), y2), y3);

                        const sx: number = $Math.max(0, xMin);
                        const sy: number = $Math.max(0, yMin);
                        const sw: number = $Math.min($Math.max(0, renderWidth  - sx), $Math.ceil($Math.abs(xMax - xMin)));
                        const sh: number = $Math.min($Math.max(0, renderHeight - sy), $Math.ceil($Math.abs(yMax - yMin)));

                        if (!sw || !sh) {
                            return ;
                        }

                        this._$gl.enable(this._$gl.SCISSOR_TEST);
                        this._$gl.scissor(sx, $Math.max(0, renderHeight - (sy + sh)), sw + 1, sh + 1);

                    } else {

                        const sx: number = $Math.max(0, x + tx);
                        const sy: number = $Math.max(0, y + ty);
                        const sw: number = $Math.min($Math.max(0, renderWidth  - sx), w);
                        const sh: number = $Math.min($Math.max(0, renderHeight - sy), h);

                        if (!sw || !sh) {
                            return ;
                        }

                        this._$gl.enable(this._$gl.SCISSOR_TEST);
                        this._$gl.scissor(sx, $Math.max(0, renderHeight - (sy + sh)), sw + 1, sh + 1);
                    }

                    this.toOperation(operation);
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);
                }
                break;

            default:
                {
                    const sx: number = $Math.max(0, x + matrix[6]);
                    const sy: number = $Math.max(0, y + matrix[7]);
                    const sw: number = $Math.min($Math.max(0, renderWidth  - sx), w);
                    const sh: number = $Math.min($Math.max(0, renderHeight - sy), h);

                    if (!sw || !sh) {
                        return ;
                    }

                    const texture: WebGLTexture = manager.getTextureFromCurrentAttachment();

                    const backTextureAttachment: AttachmentImpl = this
                        ._$context
                        .frameBuffer
                        .createTextureAttachment(w, h);

                    this._$context._$bind(backTextureAttachment);
                    manager.textureManager.bind0(texture);

                    const clipShader: CanvasToWebGLShader = variants.getClipShader();
                    const clipUniform: WebGLShaderUniform = clipShader.uniform;
                    variants.setClipUniform(
                        clipUniform, x, y, w, h,
                        $inverseMatrix(matrix), renderWidth, renderHeight
                    );

                    this.reset();
                    clipShader._$drawImage();

                    const backTexture = manager
                        .getTextureFromCurrentAttachment();

                    this._$context._$bind(currentBuffer);

                    manager.textureManager.bind01(backTexture, image, imageSmoothingEnabled);

                    const shader: CanvasToWebGLShader = variants
                        .getBlendShader(operation, withCT);

                    variants.setBlendUniform(
                        shader.uniform, x, y, w, h,
                        matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    this._$gl.enable(this._$gl.SCISSOR_TEST);
                    this._$gl.scissor(sx, $Math.max(0, renderHeight - (sy + sh)), sw, sh);

                    this.toOneZero();
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);

                    manager.releaseAttachment(backTextureAttachment, true);

                }
                break;

        }
    }
}