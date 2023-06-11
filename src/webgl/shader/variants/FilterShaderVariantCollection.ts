import { CanvasToWebGLShader } from "../CanvasToWebGLShader";
import { VertexShaderSource } from "../vertex/VertexShaderSource";
import { FragmentShaderSourceFilter } from "../fragment/filter/FragmentShaderSourceFilter";
import { FragmentShaderSourceBlurFilter } from "../fragment/filter/FragmentShaderSourceBlurFilter";
import { FragmentShaderSourceColorMatrixFilter } from "../fragment/filter/FragmentShaderSourceColorMatrixFilter";
import { FragmentShaderSourceConvolutionFilter } from "../fragment/filter/FragmentShaderSourceConvolutionFilter";
import { FragmentShaderSourceDisplacementMapFilter } from "../fragment/filter/FragmentShaderSourceDisplacementMapFilter";
import type { WebGLShaderUniform } from "../WebGLShaderUniform";
import type { CanvasToWebGLContext } from "../../CanvasToWebGLContext";
import {
    $Math,
    $getMap
} from "../../../player/util/RenderUtil";

/**
 * @class
 */
export class FilterShaderVariantCollection
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
        this._$collection = $getMap();
    }

    /**
     * @param  {number}  half_blur
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlurFilterShader (half_blur: number): CanvasToWebGLShader
    {
        const key: string = `b${half_blur}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.TEXTURE(),
            FragmentShaderSourceBlurFilter.TEMPLATE(half_blur)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {boolean} transforms_base
     * @param  {boolean} transforms_blur
     * @param  {boolean} is_glow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {boolean} applies_strength
     * @param  {boolean} is_gradient
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapFilterShader (
        transforms_base: boolean, transforms_blur: boolean,
        is_glow: boolean, type: string,
        knockout: boolean, applies_strength: boolean,
        is_gradient: boolean
    ): CanvasToWebGLShader {

        const key1: string = transforms_base ? "y" : "n";
        const key2: string = transforms_blur ? "y" : "n";
        const key3: string = is_glow ? "y" : "n";
        const key4: string = knockout ? "y" : "n";
        const key5: string = applies_strength ? "y" : "n";
        const key: string  = `f${key1}${key2}${key3}${type}${key4}${key5}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        let texturesLength = 1;
        if (transforms_base) { texturesLength++ }
        if (is_gradient) { texturesLength++ }

        let mediumpLength: number = (transforms_base ? 4 : 0)
            + (transforms_blur ? 4 : 0)
            + (applies_strength ? 1 : 0);

        if (!is_gradient) {
            mediumpLength += is_glow ? 4 : 8;
        }

        mediumpLength = $Math.ceil(mediumpLength / 4);

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.TEXTURE(),
            FragmentShaderSourceFilter.TEMPLATE(
                texturesLength, mediumpLength,
                transforms_base, transforms_blur,
                is_glow, type, knockout,
                applies_strength, is_gradient
            )
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getColorMatrixFilterShader (): CanvasToWebGLShader
    {
        const key: string = "m";

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.TEXTURE(),
            FragmentShaderSourceColorMatrixFilter.TEMPLATE()
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {number}  x
     * @param  {number}  y
     * @param  {boolean} preserve_alpha
     * @param  {boolean} clamp
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getConvolutionFilterShader (
        x: number, y: number,
        preserve_alpha: boolean, clamp: boolean
    ): CanvasToWebGLShader {

        const key1: string = ("0" + x).slice(-2);
        const key2: string = ("0" + y).slice(-2);
        const key3: string = preserve_alpha ? "y" : "n";
        const key4: string = clamp ? "y" : "n";
        const key: string  = `c${key1}${key2}${key3}${key4}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const mediumpLength: number = (clamp ? 1 : 2) + $Math.ceil(x * y / 4);

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.TEXTURE(),
            FragmentShaderSourceConvolutionFilter.TEMPLATE(
                mediumpLength, x, y, preserve_alpha, clamp
            )
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {number} component_x
     * @param  {number} component_y
     * @param  {string} mode
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getDisplacementMapFilterShader (
        component_x: number, component_y: number, mode: string
    ): CanvasToWebGLShader {

        const key: string = `d${component_x}${component_y}${mode}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const mediumpLength: number = mode === "color" ? 3 : 2;

        const shader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.TEXTURE(),
            FragmentShaderSourceDisplacementMapFilter.TEMPLATE(
                mediumpLength, component_x, component_y, mode
            )
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number}  width
     * @param  {number}  height
     * @param  {boolean} is_horizontal
     * @param  {number}  fraction
     * @param  {number}  samples
     * @return {void}
     * @method
     * @public
     */
    setBlurFilterUniform (
        uniform: WebGLShaderUniform,
        width: number, height: number,
        is_horizontal: boolean, fraction: number, samples: number
    ): void {

        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_offset
        if (is_horizontal) {
            mediump[0] = 1 / width;
            mediump[1] = 0;
        } else {
            mediump[0] = 0;
            mediump[1] = 1 / height;
        }

        // fragment: u_fraction
        mediump[2] = fraction;

        // fragment: u_samples
        mediump[3] = samples;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {number}  base_width
     * @param {number}  base_height
     * @param {number}  base_offset_x
     * @param {number}  base_offset_y
     * @param {number}  blur_width
     * @param {number}  blur_height
     * @param {number}  blur_offset_x
     * @param {number}  blur_offset_y
     * @param {boolean} is_glow
     * @param {number}  strength
     * @param {number}  color_r1
     * @param {number}  color_g1
     * @param {number}  color_b1
     * @param {number}  color_a1
     * @param {number}  color_r2
     * @param {number}  color_g2
     * @param {number}  color_b2
     * @param {number}  color_a2
     * @param {boolean} transforms_base
     * @param {boolean} transforms_blur
     * @param {boolean} applies_strength
     * @param {boolean} is_gradient
     * @method
     * @public
     */
    setBitmapFilterUniform (
        uniform: WebGLShaderUniform,
        width: number, height: number,
        base_width: number, base_height: number,
        base_offset_x: number, base_offset_y: number,
        blur_width: number, blur_height: number,
        blur_offset_x: number, blur_offset_y: number,
        is_glow: boolean, strength: number,
        color_r1: number, color_g1: number,
        color_b1: number, color_a1: number,
        color_r2: number, color_g2: number,
        color_b2: number, color_a2: number,
        transforms_base: boolean, transforms_blur: boolean,
        applies_strength: boolean, is_gradient: boolean
    ): void {

        let textures: Int32Array|Float32Array;

        // fragment: u_textures
        if (transforms_base) {

            textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 1;
            if (is_gradient) {
                textures[2] = 2;
            }

        } else if (is_gradient) {

            textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 2;

        }

        const mediump: Int32Array|Float32Array = uniform.mediump;

        let i: number = 0;

        if (transforms_base) {
            // fragment: u_uv_scale
            mediump[i]     = width / base_width;
            mediump[i + 1] = height / base_height;
            // fragment: u_uv_offset
            mediump[i + 2] = base_offset_x / base_width;
            mediump[i + 3] = (height - base_height - base_offset_y) / base_height;
            i += 4;
        }

        if (transforms_blur) {
            // fragment: u_st_scale
            mediump[i]     = width / blur_width;
            mediump[i + 1] = height / blur_height;
            // fragment: u_st_offset
            mediump[i + 2] = blur_offset_x / blur_width;
            mediump[i + 3] = (height - blur_height - blur_offset_y) / blur_height;
            i += 4;
        }

        if (is_gradient) {
            // do nothing
        } else if (is_glow) {
            // fragment: u_color
            mediump[i]     = color_r1;
            mediump[i + 1] = color_g1;
            mediump[i + 2] = color_b1;
            mediump[i + 3] = color_a1;
            i += 4;
        } else {
            // fragment: u_highlight_color
            mediump[i]     = color_r1;
            mediump[i + 1] = color_g1;
            mediump[i + 2] = color_b1;
            mediump[i + 3] = color_a1;
            // fragment: u_shadow_color
            mediump[i + 4] = color_r2;
            mediump[i + 5] = color_g2;
            mediump[i + 6] = color_b2;
            mediump[i + 7] = color_a2;
            i += 8;
        }

        if (applies_strength) {
            // fragment: u_strength
            mediump[i] = strength;
        }
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {array} matrix
     * @return {void}
     * @method
     * @public
     */
    setColorMatrixFilterUniform (
        uniform: WebGLShaderUniform,
        matrix: number[]
    ): void {

        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_mul
        mediump[0]  = matrix[0];
        mediump[1]  = matrix[1];
        mediump[2]  = matrix[2];
        mediump[3]  = matrix[3];

        mediump[4]  = matrix[5];
        mediump[5]  = matrix[6];
        mediump[6]  = matrix[7];
        mediump[7]  = matrix[8];

        mediump[8]  = matrix[10];
        mediump[9]  = matrix[11];
        mediump[10] = matrix[12];
        mediump[11] = matrix[13];

        mediump[12] = matrix[15];
        mediump[13] = matrix[16];
        mediump[14] = matrix[17];
        mediump[15] = matrix[18];

        // fragment: u_add
        mediump[16] = matrix[4]  / 255;
        mediump[17] = matrix[9]  / 255;
        mediump[18] = matrix[14] / 255;
        mediump[19] = matrix[19] / 255;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number}  width
     * @param  {number}  height
     * @param  {Float32Array} matrix
     * @param  {number}  divisor
     * @param  {number}  bias
     * @param  {boolean} clamp
     * @param  {number}  color_r
     * @param  {number}  color_g
     * @param  {number}  color_b
     * @param  {number}  color_a
     * @return {void}
     * @method
     * @public
     */
    setConvolutionFilterUniform (
        uniform: WebGLShaderUniform,
        width: number, height: number,
        matrix: number[], divisor: number,
        bias: number, clamp: boolean,
        color_r: number, color_g: number,
        color_b: number, color_a: number
    ): void {

        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_rcp_size
        mediump[0] = 1 / width;
        mediump[1] = 1 / height;

        // fragment: u_rcp_divisor
        mediump[2] = 1 / divisor;

        // fragment: u_bias
        mediump[3] = bias / 255;

        let i: number = 4;

        if (!clamp) {
            // fragment: u_substitute_color
            mediump[i]     = color_r;
            mediump[i + 1] = color_g;
            mediump[i + 2] = color_b;
            mediump[i + 3] = color_a;
            i += 4;
        }

        // fragment: u_matrix
        const length = matrix.length;
        for (let j: number = 0; j < length; j++) {
            mediump[i++] = matrix[j];
        }
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number} map_width
     * @param  {number} map_height
     * @param  {number} base_width
     * @param  {number} base_height
     * @param  {number} point_x
     * @param  {number} point_y
     * @param  {number} scale_x
     * @param  {number} scale_y
     * @param  {string} mode
     * @param  {number} color_r
     * @param  {number} color_g
     * @param  {number} color_b
     * @param  {number} color_a
     * @return {void}
     * @method
     * @public
     */
    setDisplacementMapFilterUniform (
        uniform: WebGLShaderUniform,
        map_width: number, map_height: number,
        base_width: number, base_height: number,
        point_x: number, point_y: number,
        scale_x: number, scale_y: number,
        mode: string,
        color_r: number, color_g: number,
        color_b: number, color_a: number
    ): void {

        const textures: Int32Array|Float32Array = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_uv_to_st_scale
        mediump[0] = base_width  / map_width;
        mediump[1] = base_height / map_height;
        // fragment: u_uv_to_st_offset
        mediump[2] = point_x / map_width;
        mediump[3] = (base_height - map_height - point_y) / map_height;

        // fragment: u_scale
        mediump[4] =  scale_x / base_width;
        mediump[5] = -scale_y / base_height;

        if (mode === "color") {
            // fragment: u_substitute_color
            mediump[8]  = color_r;
            mediump[9]  = color_g;
            mediump[10] = color_b;
            mediump[11] = color_a;
        }
    }
}