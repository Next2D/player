import type { CanvasToWebGLContext } from "./CanvasToWebGLContext";
import type { BlendModeImpl } from "../interface/BlendModeImpl";
import type { FrameBufferManager } from "./FrameBufferManager";
import type { AttachmentImpl } from "../interface/AttachmentImpl";
import type { CanvasToWebGLShader } from "./shader/CanvasToWebGLShader";
import {
    $Math,
    $Number,
    $inverseMatrix
} from "../util/RenderUtil";

/**
 * @class
 */
export class CanvasToWebGLContextBlend
{
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$gl: WebGL2RenderingContext;
    private _$enabled: boolean;
    private _$funcCode: number;

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

        // start
        this.enable();
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

        const withCT =
            ct0 !== 1 || ct1 !== 1 || ct2 !== 1 || ct3 !== 1 ||
            ct4 !== 0 || ct5 !== 0 || ct6 !== 0 || ct7 !== 0
        ;

        const variants = this._$context.shaderList.blendShaderVariants;

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
                        this._$gl.scissor(sx, Math.max(0, renderHeight - (sy + sh)), sw + 1, sh + 1);
                    }

                    this.toOperation(operation);
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);
                }
                break;

            default:
                {
                    const sx: number = Math.max(0, x + matrix[6]);
                    const sy: number = Math.max(0, y + matrix[7]);
                    const sw: number = Math.min(Math.max(0, renderWidth  - sx), w);
                    const sh: number = Math.min(Math.max(0, renderHeight - sy), h);

                    if (!sw || !sh) {
                        return ;
                    }

                    const texture: WebGLTexture = manager.getTextureFromCurrentAttachment();

                    const backTextureAttachment = this
                        ._$context
                        .frameBuffer
                        .createTextureAttachment(w, h);

                    this._$context._$bind(backTextureAttachment);
                    manager.textureManager.bind0(texture);

                    const clipShader = variants.getClipShader();
                    const clipUniform = clipShader.uniform;
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
                        shader.uniform, x, y, w, h, matrix, renderWidth, renderHeight,
                        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
                    );

                    this._$gl.enable(this._$gl.SCISSOR_TEST);
                    this._$gl.scissor(sx, Math.max(0, renderHeight - (sy + sh)), sw, sh);

                    this.toOneZero();
                    shader._$drawImage();

                    this._$gl.disable(this._$gl.SCISSOR_TEST);

                    manager.releaseAttachment(backTextureAttachment, true);

                }
                break;

        }
    }
}