import { VertexShaderSource } from "../vertex/VertexShaderSource";
import { FragmentShaderSourceGradientLUT } from "../fragment/FragmentShaderSourceGradientLUT";
import { CanvasToWebGLShader } from "../CanvasToWebGLShader";
import type { CanvasToWebGLContext } from "../../CanvasToWebGLContext";
import type { WebGLShaderUniform } from "../WebGLShaderUniform";

/**
 * @class
 */
export class GradientLUTShaderVariantCollection
{
    private readonly _$context: CanvasToWebGLContext;
    private readonly _$gl: WebGL2RenderingContext;
    private readonly _$collection: Map<string, CanvasToWebGLShader>;

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
         * @type {Map}
         * @private
         */
        this._$collection = new Map();
    }

    /**
     * @param  {number}  stops_length
     * @param  {boolean} is_linear_space
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getGradientLUTShader (
        stops_length: number,
        is_linear_space: boolean
    ): CanvasToWebGLShader {

        const key1: string = ("00" + stops_length).slice(-3);
        const key2: string = is_linear_space ? "y" : "n";
        const key: string  = `l${key1}${key2}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const mediumpLength: number = Math.ceil(stops_length * 5 / 4);

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.TEXTURE(),
            FragmentShaderSourceGradientLUT.TEMPLATE(mediumpLength, stops_length, is_linear_space)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {array} stops
     * @param  {number} begin
     * @param  {number} end
     * @param  {Float32Array} table
     * @return {void}
     * @method
     * @public
     */
    setGradientLUTUniformForShape (
        uniform: WebGLShaderUniform,
        stops: any[],
        begin: number, end: number,
        table: Float32Array
    ): void {

        let i: number = 0;
        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_gradient_color
        for (let j: number = begin; j < end; j++) {

            const color: number[] = stops[j][1];
            mediump[i++] = table[color[0]];
            mediump[i++] = table[color[1]];
            mediump[i++] = table[color[2]];
            mediump[i++] = table[color[3]];
        }

        // fragment: u_gradient_t
        for (let j: number = begin; j < end; j++) {
            mediump[i++] = stops[j][0];
        }
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {array}  ratios
     * @param  {array}  colors
     * @param  {array}  alphas
     * @param  {number} begin
     * @param  {number} end
     * @return {void}
     * @method
     * @public
     */
    setGradientLUTUniformForFilter (
        uniform: WebGLShaderUniform,
        ratios: number[], colors: number[], alphas: number[],
        begin: number, end: number
    ): void {

        let i: number = 0;
        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_gradient_color
        for (let j: number = begin; j < end; j++) {

            const color: number = colors[j];

            mediump[i++] = (color  >>  16)        / 255;
            mediump[i++] = (color  >>   8 & 0xFF) / 255;
            mediump[i++] = (color         & 0xFF) / 255;
            mediump[i++] = alphas[j];
        }

        // fragment: u_gradient_t
        for (let j: number = begin; j < end; j++) {
            mediump[i++] = ratios[j];
        }
    }
}