import type { CanvasToWebGLContext } from "../CanvasToWebGLContext";
import type { AttachmentImpl } from "../../interface/AttachmentImpl";
import type { GradientLUTShaderVariantCollection } from "./variants/GradientLUTShaderVariantCollection";
import type { CanvasToWebGLShader } from "./CanvasToWebGLShader";
import type { WebGLShaderUniform } from "./WebGLShaderUniform";
import { $Math } from "../../util/RenderUtil";

/**
 * @class
 */
export class GradientLUTGenerator
{
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$attachment: AttachmentImpl;
    private readonly _$maxLength: number;
    private readonly _$rgbToLinearTable: Float32Array;
    private readonly _$rgbIdentityTable: Float32Array;

    /**
     * @param {CanvasToWebGLContext}  context
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
         * @type {AttachmentImpl}
         * @private
         */
        this._$attachment = context
            .frameBuffer
            .createTextureAttachment(512, 1);

        /**
         * @type {number}
         * @private
         */
        this._$maxLength = $Math.floor(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) * 0.75);

        /**
         * @type {Float32Array}
         * @private
         */
        this._$rgbToLinearTable = new Float32Array(256);

        /**
         * @type {Float32Array}
         * @private
         */
        this._$rgbIdentityTable = new Float32Array(256);

        for (let i: number = 0; i < 256; i++) {
            const t: number = i / 255;
            this._$rgbToLinearTable[i] = $Math.pow(t, 2.23333333);
            this._$rgbIdentityTable[i] = t;
        }
    }

    /**
     * @param  {array}   stops
     * @param  {boolean} is_linear_space
     * @return {WebGLTexture|null}
     * @method
     * @public
     */
    generateForShape (
        stops: any[], is_linear_space: boolean
    ): WebGLTexture {

        const currentAttachment: AttachmentImpl | null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        this._$context._$bind(this._$attachment);

        const stopsLength: number = stops.length;

        const variants: GradientLUTShaderVariantCollection = this
            ._$context
            .shaderList
            .gradientLUTShaderVariants;

        const table: Float32Array = is_linear_space
            ? this._$rgbToLinearTable
            : this._$rgbIdentityTable;

        this._$context.blend.toOneZero();

        for (let begin: number = 0; begin < stopsLength; begin += this._$maxLength - 1) {

            const end: number = $Math.min(begin + this._$maxLength, stopsLength);

            const shader: CanvasToWebGLShader = variants
                .getGradientLUTShader(end - begin, is_linear_space);

            const uniform: WebGLShaderUniform = shader.uniform;
            variants
                .setGradientLUTUniformForShape(uniform, stops, begin, end, table);

            shader._$drawGradient(
                begin === 0 ? 0 : stops[begin][0],
                end === stopsLength ? 1 : stops[end - 1][0]
            );
        }

        this._$context._$bind(currentAttachment);

        if (!this._$attachment.texture) {
            throw new Error("the texture is null.");
        }

        return this._$attachment.texture;
    }

    /**
     * @param  {array} ratios
     * @param  {array} colors
     * @param  {array} alphas
     * @return {WebGLTexture}
     * @method
     * @public
     */
    generateForFilter (
        ratios: number[],
        colors: number[],
        alphas: number[]
    ): WebGLTexture {

        const currentAttachment: AttachmentImpl|null = this
            ._$context
            .frameBuffer
            .currentAttachment;

        this._$context._$bind(this._$attachment);

        const stopsLength: number = ratios.length;

        const variants: GradientLUTShaderVariantCollection = this
            ._$context
            .shaderList
            .gradientLUTShaderVariants;

        this._$context.blend.toOneZero();

        for (let begin: number = 0; begin < stopsLength; begin += this._$maxLength - 1) {

            const end: number = $Math.min(begin + this._$maxLength, stopsLength);

            const shader: CanvasToWebGLShader = variants
                .getGradientLUTShader(end - begin, false);

            const uniform: WebGLShaderUniform = shader.uniform;

            variants
                .setGradientLUTUniformForFilter(uniform, ratios, colors, alphas, begin, end);

            shader._$drawGradient(
                begin === 0 ? 0 : ratios[begin],
                end === stopsLength ? 1 : ratios[end - 1]
            );
        }

        this._$context._$bind(currentAttachment);

        if (!this._$attachment.texture) {
            throw new Error("the texture is null.");
        }

        return this._$attachment.texture;
    }
}