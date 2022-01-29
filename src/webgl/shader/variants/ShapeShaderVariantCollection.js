/**
 * @class
 */
class ShapeShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     * @public
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} has_grid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getSolidColorShapeShader (is_stroke, has_grid)
    {
        const key = `s${is_stroke ? "y" : "n"}${has_grid ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = (has_grid ? 8 : 3) + (is_stroke ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (is_stroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    false, false, has_grid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    false, false, has_grid
                );
            }

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSource.SOLID_COLOR(this._$keyword)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} repeat
     * @param  {boolean} has_grid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapShapeShader (is_stroke, repeat, has_grid)
    {
        const key = `b${is_stroke ? "y" : "n"}${repeat ? "y" : "n"}${has_grid ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = (has_grid ? 13 : 5) + (is_stroke ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (is_stroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    true, false, has_grid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    true, false, has_grid
                );
            }

            const fragmentShaderSource = repeat
                ? FragmentShaderSource.BITMAP_PATTERN(this._$keyword)
                : FragmentShaderSource.BITMAP_CLIPPED(this._$keyword);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                fragmentShaderSource
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} has_grid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getMaskShapeShader (is_stroke, has_grid)
    {
        const key = `m${is_stroke ? "y" : "n"}${has_grid ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = (has_grid ? 8 : 3) + (is_stroke ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (is_stroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    false, true, has_grid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    false, true, has_grid
                );
            }

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSource.MASK(this._$keyword)
            ));
        }

        return this._$collection.get(key);
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
     * @param {CanvasToWebGLContextGrid} grid
     * @param {array}   color
     * @param {number}  alpha
     * @method
     * @public
     */
    setSolidColorShapeUniform (
        uniform,
        is_stroke, half_width, face, miter_limit,
        has_grid, matrix,
        viewport_width, viewport_height, grid,
        color, alpha
    ) {
        const highp = uniform.highp;
        let i;

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

        const mediump = uniform.mediump;

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
     * @param {array}   matrix
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
     * @method
     * @public
     */
    setBitmapShapeUniform (
        uniform,
        is_stroke, half_width, face, miter_limit,
        has_grid, matrix, inverse_matrix,
        viewport_width, viewport_height, grid,
        texture_width, texture_height,
        mul1, mul2, mul3, mul4,
        add1, add2, add3, add4
    ) {
        const highp = uniform.highp;
        let i;

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

        const mediump = uniform.mediump;

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
     * @param {WebGLShaderUniform} uniform
     * @param {boolean} hasGrid
     * @param {number}  matrix_a
     * @param {number}  matrix_b
     * @param {number}  matrix_c
     * @param {number}  matrix_d
     * @param {number}  matrix_e
     * @param {number}  matrix_f
     * @param {number}  matrix_g
     * @param {number}  matrix_h
     * @param {number}  matrix_i
     * @param {number}  viewport_width
     * @param {number}  viewport_height
     * @param {CanvasToWebGLContextGrid} grid
     * @method
     * @public
     */
    setMaskShapeUniform (
        uniform, hasGrid,
        matrix_a, matrix_b, matrix_c,
        matrix_d, matrix_e, matrix_f,
        matrix_g, matrix_h, matrix_i,
        viewport_width, viewport_height, grid
    ) {
        const highp = uniform.highp;

        if (hasGrid) {
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
     * @param {WebGLShaderUniform} uniform
     * @param {number} width
     * @param {number} height
     * @method
     * @public
     */
    setMaskShapeUniformIdentity (uniform, width, height)
    {
        const highp = uniform.highp;

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