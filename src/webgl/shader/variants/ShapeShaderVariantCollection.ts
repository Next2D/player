import { CanvasToWebGLShader } from "../CanvasToWebGLShader";
import { WebGLShaderUniform } from "../WebGLShaderUniform";
import { VertexShaderSourceStroke } from "../vertex/VertexShaderSourceStroke";
import { VertexShaderSourceFill } from "../vertex/VertexShaderSourceFill";
import { FragmentShaderSource } from "../fragment/FragmentShaderSource";
import { CanvasToWebGLContext } from "../../CanvasToWebGLContext";
import { CanvasToWebGLContextGrid } from "../../CanvasToWebGLContextGrid";
import { $getMap } from "../../../player/util/RenderUtil";

/**
 * @class
 */
export class ShapeShaderVariantCollection
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
     * @param  {boolean} is_stroke
     * @param  {boolean} has_grid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getSolidColorShapeShader (
        is_stroke: boolean,
        has_grid: boolean
    ): CanvasToWebGLShader {

        const key: string = `s${is_stroke ? "y" : "n"}${has_grid ? "y" : "n"}`;
        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const highpLength: number = (has_grid ? 8 : 3) + (is_stroke ? 1 : 0);
        const fragmentIndex: number = highpLength;

        let vertexShaderSource: string;
        if (is_stroke) {
            vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                highpLength, fragmentIndex,
                false, has_grid
            );
        } else {
            vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                highpLength, false, false, has_grid
            );
        }

        const shader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            vertexShaderSource,
            FragmentShaderSource.SOLID_COLOR()
        );
        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} repeat
     * @param  {boolean} has_grid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapShapeShader (
        is_stroke: boolean,
        repeat: boolean,
        has_grid: boolean
    ): CanvasToWebGLShader {

        const key: string = `b${is_stroke ? "y" : "n"}${repeat ? "y" : "n"}${has_grid ? "y" : "n"}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const highpLength: number = (has_grid ? 13 : 5) + (is_stroke ? 1 : 0);
        const fragmentIndex: number = highpLength;

        let vertexShaderSource: string;
        if (is_stroke) {
            vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                highpLength, fragmentIndex,
                true, has_grid
            );
        } else {
            vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                highpLength, true, false, has_grid
            );
        }

        const fragmentShaderSource = repeat
            ? FragmentShaderSource.BITMAP_PATTERN()
            : FragmentShaderSource.BITMAP_CLIPPED();

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            vertexShaderSource,
            fragmentShaderSource
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} has_grid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getMaskShapeShader (
        is_stroke: boolean,
        has_grid: boolean
    ): CanvasToWebGLShader {

        const key: string = `m${is_stroke ? "y" : "n"}${has_grid ? "y" : "n"}`;

        if (this._$collection.has(key)) {
            const shader: CanvasToWebGLShader|void = this._$collection.get(key);
            if (shader) {
                return shader;
            }
        }

        const highpLength: number   = (has_grid ? 8 : 3) + (is_stroke ? 1 : 0);
        const fragmentIndex: number = highpLength;

        let vertexShaderSource: string;
        if (is_stroke) {
            vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                highpLength, fragmentIndex,
                false, has_grid
            );
        } else {
            vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                highpLength, false, true, has_grid
            );
        }

        const shader: CanvasToWebGLShader = new CanvasToWebGLShader(
            this._$gl, this._$context,
            vertexShaderSource,
            FragmentShaderSource.MASK()
        );

        this._$collection.set(key, shader);

        return shader;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {boolean} is_stroke
     * @param {number}  half_width
     * @param {number}  face
     * @param {number}  miter_limit
     * @param {boolean} has_grid
     * @param {array}   matrix
     * @param {number}  viewport_width
     * @param {number}  viewport_height
     * @param {CanvasToWebGLContextGrid} [grid = null]
     * @param {array}   color
     * @param {number}  alpha
     * @method
     * @public
     */
    setSolidColorShapeUniform (
        uniform: WebGLShaderUniform,
        is_stroke: boolean, half_width: number,
        face: number, miter_limit: number,
        has_grid: boolean, matrix: Float32Array,
        viewport_width: number, viewport_height: number,
        grid: CanvasToWebGLContextGrid,
        color: Float32Array, alpha: number
    ): void {

        const highp: Int32Array|Float32Array = uniform.highp;
        let i: number;

        if (has_grid) {
            // vertex: u_parent_matrix
            highp[0]  = grid.parentMatrixA;
            highp[1]  = grid.parentMatrixB;
            highp[2]  = grid.parentMatrixC;

            highp[4]  = grid.parentMatrixD;
            highp[5]  = grid.parentMatrixE;
            highp[6]  = grid.parentMatrixF;

            highp[8]  = grid.parentMatrixG;
            highp[9]  = grid.parentMatrixH;
            highp[10] = grid.parentMatrixI;

            // vertex: u_ancestor_matrix
            highp[12] = grid.ancestorMatrixA;
            highp[13] = grid.ancestorMatrixB;
            highp[14] = grid.ancestorMatrixC;

            highp[16] = grid.ancestorMatrixD;
            highp[17] = grid.ancestorMatrixE;
            highp[18] = grid.ancestorMatrixF;

            highp[20] = grid.ancestorMatrixG;
            highp[21] = grid.ancestorMatrixH;
            highp[22] = grid.ancestorMatrixI;

            // vertex: u_viewport
            highp[3]  = viewport_width;
            highp[7]  = viewport_height;

            // vertex: u_parent_viewport
            highp[11] = grid.parentViewportX;
            highp[15] = grid.parentViewportY;
            highp[19] = grid.parentViewportW;
            highp[23] = grid.parentViewportH;

            // vertex: u_grid_min
            highp[24] = grid.minXST;
            highp[25] = grid.minYST;
            highp[26] = grid.minXPQ;
            highp[27] = grid.minYPQ;
            // vertex: u_grid_max
            highp[28] = grid.maxXST;
            highp[29] = grid.maxYST;
            highp[30] = grid.maxXPQ;
            highp[31] = grid.maxYPQ;

            i = 32;
        } else {
            // vertex: u_matrix
            highp[0]  = matrix[0];
            highp[1]  = matrix[1];
            highp[2]  = matrix[2];

            highp[4]  = matrix[3];
            highp[5]  = matrix[4];
            highp[6]  = matrix[5];

            highp[8]  = matrix[6];
            highp[9]  = matrix[7];
            highp[10] = matrix[8];

            // vertex: u_viewport
            highp[3] = viewport_width;
            highp[7] = viewport_height;

            i = 12;
        }

        if (is_stroke) {
            // vertex: u_half_width
            highp[i]     = half_width;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miter_limit;
        }

        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_color
        mediump[0] = color[0];
        mediump[1] = color[1];
        mediump[2] = color[2];
        mediump[3] = color[3] * alpha;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {boolean} is_stroke
     * @param {number}  half_width
     * @param {number}  face
     * @param {number}  miter_limit
     * @param {boolean} has_grid
     * @param {Float32Array} matrix
     * @param {array}   inverse_matrix
     * @param {number}  viewport_width
     * @param {number}  viewport_height
     * @param {CanvasToWebGLContextGrid} grid
     * @param {number}  texture_width
     * @param {number}  texture_height
     * @param {number}  mul1
     * @param {number}  mul2
     * @param {number}  mul3
     * @param {number}  mul4
     * @param {number}  add1
     * @param {number}  add2
     * @param {number}  add3
     * @param {number}  add4
     * @return {void}
     * @method
     * @public
     */
    setBitmapShapeUniform (
        uniform: WebGLShaderUniform,
        is_stroke: boolean, half_width: number,
        face: number, miter_limit: number,
        has_grid: boolean,
        matrix: Float32Array, inverse_matrix: Float32Array,
        viewport_width: number, viewport_height: number,
        grid: CanvasToWebGLContextGrid,
        texture_width: number, texture_height: number,
        mul1: number, mul2: number, mul3: number, mul4: number,
        add1: number, add2: number, add3: number, add4: number
    ): void {

        const highp: Int32Array|Float32Array = uniform.highp;
        let i: number;

        // vertex: u_matrix
        highp[0]  = matrix[0];
        highp[1]  = matrix[1];
        highp[2]  = matrix[2];

        highp[4]  = matrix[3];
        highp[5]  = matrix[4];
        highp[6]  = matrix[5];

        highp[8]  = matrix[6];
        highp[9]  = matrix[7];
        highp[10] = matrix[8];

        // vertex: u_inverse_matrix
        highp[12] = inverse_matrix[0];
        highp[13] = inverse_matrix[1];
        highp[14] = inverse_matrix[2];

        highp[16] = inverse_matrix[3];
        highp[17] = inverse_matrix[4];
        highp[18] = inverse_matrix[5];

        highp[11] = inverse_matrix[6];
        highp[15] = inverse_matrix[7];
        highp[19] = inverse_matrix[8];

        // vertex: u_viewport
        highp[3] = viewport_width;
        highp[7] = viewport_height;

        i = 20;

        if (has_grid) {
            // vertex: u_parent_matrix
            highp[i]      = grid.parentMatrixA;
            highp[i + 1]  = grid.parentMatrixB;
            highp[i + 2]  = grid.parentMatrixC;

            highp[i + 4]  = grid.parentMatrixD;
            highp[i + 5]  = grid.parentMatrixE;
            highp[i + 6]  = grid.parentMatrixF;

            highp[i + 8]  = grid.parentMatrixG;
            highp[i + 9]  = grid.parentMatrixH;
            highp[i + 10] = grid.parentMatrixI;

            // vertex: u_ancestor_matrix
            highp[i + 12] = grid.ancestorMatrixA;
            highp[i + 13] = grid.ancestorMatrixB;
            highp[i + 14] = grid.ancestorMatrixC;

            highp[i + 16] = grid.ancestorMatrixD;
            highp[i + 17] = grid.ancestorMatrixE;
            highp[i + 18] = grid.ancestorMatrixF;

            highp[i + 20] = grid.ancestorMatrixG;
            highp[i + 21] = grid.ancestorMatrixH;
            highp[i + 22] = grid.ancestorMatrixI;

            // vertex: u_parent_viewport
            highp[i + 11] = grid.parentViewportX;
            highp[i + 15] = grid.parentViewportY;
            highp[i + 19] = grid.parentViewportW;
            highp[i + 23] = grid.parentViewportH;

            // vertex: u_grid_min
            highp[i + 24] = grid.minXST;
            highp[i + 25] = grid.minYST;
            highp[i + 26] = grid.minXPQ;
            highp[i + 27] = grid.minYPQ;
            // vertex: u_grid_max
            highp[i + 28] = grid.maxXST;
            highp[i + 29] = grid.maxYST;
            highp[i + 30] = grid.maxXPQ;
            highp[i + 31] = grid.maxYPQ;

            i = 52;
        }

        if (is_stroke) {
            // vertex: u_half_width
            highp[i]     = half_width;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miter_limit;
        }

        const mediump: Int32Array|Float32Array = uniform.mediump;

        // fragment: u_uv
        mediump[0] = texture_width;
        mediump[1] = texture_height;

        // fragment: u_color_transform_mul
        mediump[4] = mul1;
        mediump[5] = mul2;
        mediump[6] = mul3;
        mediump[7] = mul4;
        // fragment: u_color_transform_add
        mediump[8]  = add1;
        mediump[9]  = add2;
        mediump[10] = add3;
        mediump[11] = add4;
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {boolean} has_grid
     * @param  {number}  matrix_a
     * @param  {number}  matrix_b
     * @param  {number}  matrix_c
     * @param  {number}  matrix_d
     * @param  {number}  matrix_e
     * @param  {number}  matrix_f
     * @param  {number}  matrix_g
     * @param  {number}  matrix_h
     * @param  {number}  matrix_i
     * @param  {number}  viewport_width
     * @param  {number}  viewport_height
     * @param  {CanvasToWebGLContextGrid} grid
     * @return {void}
     * @method
     * @public
     */
    setMaskShapeUniform (
        uniform: WebGLShaderUniform,
        has_grid: boolean,
        matrix_a: number, matrix_b: number, matrix_c: number,
        matrix_d: number, matrix_e: number, matrix_f: number,
        matrix_g: number, matrix_h: number, matrix_i: number,
        viewport_width: number, viewport_height: number,
        grid: CanvasToWebGLContextGrid | null = null
    ): void {

        const highp: Int32Array|Float32Array = uniform.highp;

        if (has_grid && grid) {
            // vertex: u_parent_matrix
            highp[0]  = grid.parentMatrixA;
            highp[1]  = grid.parentMatrixB;
            highp[2]  = grid.parentMatrixC;

            highp[4]  = grid.parentMatrixD;
            highp[5]  = grid.parentMatrixE;
            highp[6]  = grid.parentMatrixF;

            highp[8]  = grid.parentMatrixG;
            highp[9]  = grid.parentMatrixH;
            highp[10] = grid.parentMatrixI;

            // vertex: u_ancestor_matrix
            highp[12] = grid.ancestorMatrixA;
            highp[13] = grid.ancestorMatrixB;
            highp[14] = grid.ancestorMatrixC;

            highp[16] = grid.ancestorMatrixD;
            highp[17] = grid.ancestorMatrixE;
            highp[18] = grid.ancestorMatrixF;

            highp[20] = grid.ancestorMatrixG;
            highp[21] = grid.ancestorMatrixH;
            highp[22] = grid.ancestorMatrixI;

            // vertex: u_viewport
            highp[3]  = viewport_width;
            highp[7]  = viewport_height;

            // vertex: u_parent_viewport
            highp[11] = grid.parentViewportX;
            highp[15] = grid.parentViewportY;
            highp[19] = grid.parentViewportW;
            highp[23] = grid.parentViewportH;

            // vertex: u_grid_min
            highp[24] = grid.minXST;
            highp[25] = grid.minYST;
            highp[26] = grid.minXPQ;
            highp[27] = grid.minYPQ;
            // vertex: u_grid_max
            highp[28] = grid.maxXST;
            highp[29] = grid.maxYST;
            highp[30] = grid.maxXPQ;
            highp[31] = grid.maxYPQ;
        } else {
            // vertex: u_matrix
            highp[0]  = matrix_a;
            highp[1]  = matrix_b;
            highp[2]  = matrix_c;

            highp[4]  = matrix_d;
            highp[5]  = matrix_e;
            highp[6]  = matrix_f;

            highp[8]  = matrix_g;
            highp[9]  = matrix_h;
            highp[10] = matrix_i;

            // vertex: u_viewport
            highp[3] = viewport_width;
            highp[7] = viewport_height;
        }
    }

    /**
     * @param  {WebGLShaderUniform} uniform
     * @param  {number} width
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    setMaskShapeUniformIdentity (
        uniform: WebGLShaderUniform,
        width: number, height: number
    ): void {

        const highp: Int32Array|Float32Array = uniform.highp;

        // vertex: u_matrix
        highp[0]  = 1;
        highp[1]  = 0;
        highp[2]  = 0;

        highp[4]  = 0;
        highp[5]  = 1;
        highp[6]  = 0;

        highp[8]  = 0;
        highp[9]  = 0;
        highp[10] = 1;

        // vertex: u_viewport
        highp[3] = width;
        highp[7] = height;
    }
}