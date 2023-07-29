import { CanvasToWebGLShader } from "../CanvasToWebGLShader";
import { VertexShaderSource } from "../vertex/VertexShaderSource";
import { FragmentShaderSourceTexture } from "../fragment/FragmentShaderSourceTexture";
import { FragmentShaderSourceBlend } from "../fragment/FragmentShaderSourceBlend";
import type { CanvasToWebGLContext } from "../../CanvasToWebGLContext";
import type { WebGLShaderUniform } from "../WebGLShaderUniform";
import type { WebGLShaderInstance } from "../WebGLShaderInstance";
import { $getMap } from "@next2d/share";
import { $RENDER_SIZE } from "../../Const";

/**
 * @class
 */
export class BlendShaderVariantCollection
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
     * @param  {boolean} with_color_transform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getInstanceShader (with_color_transform: boolean): CanvasToWebGLShader
    {
        const key: string = `i${with_color_transform ? "y" : "n"}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader | void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.INSTANCE(with_color_transform),
            FragmentShaderSourceTexture.INSTANCE_TEMPLATE(with_color_transform)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {boolean} with_color_transform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getNormalBlendShader (with_color_transform: boolean): CanvasToWebGLShader
    {
        const key: string = `n${with_color_transform ? "y" : "n"}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.BLEND(),
            FragmentShaderSourceTexture.TEMPLATE(with_color_transform)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getClipShader (): CanvasToWebGLShader
    {
        const key: string = "c";

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.BLEND_CLIP(),
            FragmentShaderSourceTexture.TEMPLATE(false)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {string}  operation
     * @param  {boolean} with_color_transform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlendShader (
        operation: string,
        with_color_transform: boolean
    ): CanvasToWebGLShader {

        const key: string = `${operation}${with_color_transform ? "y" : "n"}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.BLEND(),
            FragmentShaderSourceBlend.TEMPLATE(operation, with_color_transform)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {string}  operation
     * @param  {boolean} with_color_transform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getInstanceBlendShader (
        operation: string,
        with_color_transform: boolean
    ): CanvasToWebGLShader {

        const key: string = `i${operation}${with_color_transform ? "y" : "n"}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader | void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            VertexShaderSource.INSTANCE_BLEND(),
            FragmentShaderSourceBlend.INSTANCE_TEMPLATE(operation, with_color_transform)
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number}  x
     * @param  {number}  y
     * @param  {number}  w
     * @param  {number}  h
     * @param  {Float32Array} matrix
     * @param  {number}  render_width
     * @param  {number}  render_height
     * @param  {boolean} with_color_transform
     * @param  {number}  ct0
     * @param  {number}  ct1
     * @param  {number}  ct2
     * @param  {number}  ct3
     * @param  {number}  ct4
     * @param  {number}  ct5
     * @param  {number}  ct6
     * @param  {number}  ct7
     * @return {void}
     * @method
     * @public
     */
    setNormalBlendUniform (
        uniform: WebGLShaderUniform,
        x: number, y: number, w: number, h: number,
        matrix: Float32Array, render_width: number, render_height: number,
        with_color_transform: boolean,
        ct0: number, ct1: number, ct2: number, ct3: number,
        ct4: number, ct5: number, ct6: number, ct7: number
    ): void {

        const highp: Int32Array|Float32Array = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_matrix
        highp[4]  = matrix[0];
        highp[5]  = matrix[1];
        highp[6]  = matrix[2];

        highp[8]  = matrix[3];
        highp[9]  = matrix[4];
        highp[10] = matrix[5];

        highp[12] = matrix[6];
        highp[13] = matrix[7];
        highp[14] = matrix[8];

        // vertex: u_viewport
        highp[7]  = render_width;
        highp[11] = render_height;

        if (with_color_transform) {

            const mediump: Int32Array|Float32Array = uniform.mediump;

            // fragment: u_color_transform_mul
            mediump[0] = ct0;
            mediump[1] = ct1;
            mediump[2] = ct2;
            mediump[3] = ct3;
            // fragment: u_color_transform_add
            mediump[4] = ct4;
            mediump[5] = ct5;
            mediump[6] = ct6;
            mediump[7] = ct7;
        }
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number}  x
     * @param  {number}  y
     * @param  {number}  w
     * @param  {number}  h
     * @param  {Float32Array} matrix
     * @param  {number}  render_width
     * @param  {number}  render_height
     * @param  {boolean} with_color_transform
     * @param  {number}  ct0
     * @param  {number}  ct1
     * @param  {number}  ct2
     * @param  {number}  ct3
     * @param  {number}  ct4
     * @param  {number}  ct5
     * @param  {number}  ct6
     * @param  {number}  ct7
     * @return {void}
     * @method
     * @public
     */
    pushNormalBlend (
        instance: WebGLShaderInstance,
        x: number, y: number, w: number, h: number,
        matrix: Float32Array, render_width: number, render_height: number,
        with_color_transform: boolean,
        ct0: number = 1, ct1: number = 1, ct2: number = 1, ct3: number = 1,
        ct4: number = 0, ct5: number = 0, ct6: number = 0, ct7: number = 0
    ): void {

        // texture rectangle
        instance.rect.push(
            x / $RENDER_SIZE, y / $RENDER_SIZE,
            w / $RENDER_SIZE, h / $RENDER_SIZE
        );

        // texture width, height and viewport width, height
        instance.size.push(w, h, render_width, render_height);

        // matrix tx, ty
        instance.offset.push(matrix[6], matrix[7]);

        // matrix scale0, rotate0, scale1, rotate1
        instance.matrix.push(
            matrix[0], matrix[1],
            matrix[3], matrix[4]
        );

        // color transform params
        if (with_color_transform) {
            instance.mulColor.push(ct0, ct1, ct2, ct3);
            instance.addColor.push(ct4, ct5, ct6, ct7);
        }

        instance.count++;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number} x
     * @param  {number} y
     * @param  {number} w
     * @param  {number} h
     * @param  {Float32Array} inverse_matrix
     * @param  {number} render_width
     * @param  {number} render_height
     * @return {void}
     * @method
     * @public
     */
    setClipUniform (
        uniform: WebGLShaderUniform,
        x: number, y: number, w: number, h: number,
        inverse_matrix: Float32Array, render_width: number, render_height: number
    ): void {

        const highp: Int32Array|Float32Array = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_inverse_matrix
        highp[4]  = inverse_matrix[0];
        highp[5]  = inverse_matrix[1];
        highp[6]  = inverse_matrix[2];

        highp[8]  = inverse_matrix[3];
        highp[9]  = inverse_matrix[4];
        highp[10] = inverse_matrix[5];

        highp[12] = inverse_matrix[6];
        highp[13] = inverse_matrix[7];
        highp[14] = inverse_matrix[8];

        // vertex: u_viewport
        highp[7]  = render_width;
        highp[11] = render_height;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number}  x
     * @param  {number}  y
     * @param  {number}  w
     * @param  {number}  h
     * @param  {Float32Array} matrix
     * @param  {number}  render_width
     * @param  {number}  render_height
     * @param  {boolean} with_color_transform
     * @param  {number}  ct0
     * @param  {number}  ct1
     * @param  {number}  ct2
     * @param  {number}  ct3
     * @param  {number}  ct4
     * @param  {number}  ct5
     * @param  {number}  ct6
     * @param  {number}  ct7
     * @return {void}
     * @method
     * @public
     */
    setInstanceBlendUniform (
        uniform: WebGLShaderUniform,
        x: number, y: number, w: number, h: number,
        texture_width: number, texture_height: number,
        matrix: Float32Array, render_width: number, render_height: number,
        with_color_transform: boolean,
        ct0: number, ct1: number, ct2: number, ct3: number,
        ct4: number, ct5: number, ct6: number, ct7: number
    ): void {

        const textures: Int32Array|Float32Array = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const highp: Int32Array|Float32Array = uniform.highp;

        // vertex: u_rect
        highp[0] = x;
        highp[1] = y;
        highp[2] = w;
        highp[3] = h;

        // vertex: u_matrix
        highp[4]  = matrix[0];
        highp[5]  = matrix[1];
        highp[6]  = matrix[2];

        highp[8]  = matrix[3];
        highp[9]  = matrix[4];
        highp[10] = matrix[5];

        highp[12] = matrix[6];
        highp[13] = matrix[7];
        highp[14] = matrix[8];

        // vertex: u_viewport
        highp[7]  = render_width;
        highp[11] = render_height;

        // vertex: u_size
        highp[16] = texture_width;
        highp[17] = texture_height;

        if (with_color_transform) {

            const mediump: Int32Array|Float32Array = uniform.mediump;

            // fragment: u_color_transform_mul
            mediump[0] = ct0;
            mediump[1] = ct1;
            mediump[2] = ct2;
            mediump[3] = ct3;
            // fragment: u_color_transform_add
            mediump[4] = ct4;
            mediump[5] = ct5;
            mediump[6] = ct6;
            mediump[7] = ct7;
        }
    }

    setBlendUniform (
        uniform: WebGLShaderUniform,
        x: number, y: number, w: number, h: number,
        matrix: Float32Array, render_width: number, render_height: number,
        with_color_transform: boolean,
        ct0: number, ct1: number, ct2: number, ct3: number,
        ct4: number, ct5: number, ct6: number, ct7: number
    ): void {

        const textures: Int32Array|Float32Array = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const highp: Int32Array|Float32Array = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_matrix
        highp[4]  = matrix[0];
        highp[5]  = matrix[1];
        highp[6]  = matrix[2];

        highp[8]  = matrix[3];
        highp[9]  = matrix[4];
        highp[10] = matrix[5];

        highp[12] = matrix[6];
        highp[13] = matrix[7];
        highp[14] = matrix[8];

        // vertex: u_viewport
        highp[7]  = render_width;
        highp[11] = render_height;

        if (with_color_transform) {

            const mediump: Int32Array|Float32Array = uniform.mediump;

            // fragment: u_color_transform_mul
            mediump[0] = ct0;
            mediump[1] = ct1;
            mediump[2] = ct2;
            mediump[3] = ct3;
            // fragment: u_color_transform_add
            mediump[4] = ct4;
            mediump[5] = ct5;
            mediump[6] = ct6;
            mediump[7] = ct7;
        }
    }
}
