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
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getSolidColorShapeShader (isStroke, hasGrid)
    {
        const key = `s${(isStroke) ? "y" : "n"}${(hasGrid) ? "y" : "n"}`;        

        if (!this._$collection.has(key)) {
            const highpLength = ((hasGrid) ? 8 : 3) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    false, false, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    false, false, hasGrid
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
     * @param  {boolean} isStroke
     * @param  {boolean} repeat
     * @param  {boolean} hasGrid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapShapeShader (isStroke, repeat, hasGrid)
    {
        const key = `b${(isStroke) ? "y" : "n"}${(repeat) ? "y" : "n"}${(hasGrid) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = ((hasGrid) ? 13 : 5) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    true, false, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    true, false, hasGrid
                );
            }

            const fragmentShaderSource = (repeat)
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
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getMaskShapeShader (isStroke, hasGrid)
    {
        const key = `m${(isStroke) ? "y" : "n"}${(hasGrid) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            const highpLength = ((hasGrid) ? 8 : 3) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            let vertexShaderSource;
            if (isStroke) {
                vertexShaderSource = VertexShaderSourceStroke.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    false, true, hasGrid
                );
            } else {
                vertexShaderSource = VertexShaderSourceFill.TEMPLATE(
                    this._$keyword, highpLength,
                    false, true, hasGrid
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
     * @param isStroke
     * @param halfWidth
     * @param face
     * @param miterLimit
     * @param hasGrid
     * @param matrix
     * @param viewport
     * @param grid
     * @param color
     * @param alpha
     * @method
     * @public
     */
    setSolidColorShapeUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, viewport, grid,
        color, alpha
    ) {
        const highp = uniform.highp;
        let i;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[0]  = parentMatrix[0];
            highp[1]  = parentMatrix[1];
            highp[2]  = parentMatrix[2];

            highp[4]  = parentMatrix[3];
            highp[5]  = parentMatrix[4];
            highp[6]  = parentMatrix[5];

            highp[8]  = parentMatrix[6];
            highp[9]  = parentMatrix[7];
            highp[10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[12] = ancestorMatrix[0];
            highp[13] = ancestorMatrix[1];
            highp[14] = ancestorMatrix[2];

            highp[16] = ancestorMatrix[3];
            highp[17] = ancestorMatrix[4];
            highp[18] = ancestorMatrix[5];

            highp[20] = ancestorMatrix[6];
            highp[21] = ancestorMatrix[7];
            highp[22] = ancestorMatrix[8];

            // vertex: u_viewport
            highp[3] = viewport[0];
            highp[7] = viewport[1];

            // vertex: u_parent_viewport
            highp[11] = parentViewport[0];
            highp[15] = parentViewport[1];
            highp[19] = parentViewport[2];
            highp[23] = parentViewport[3];

            // vertex: u_grid_min
            highp[24] = gridMin[0];
            highp[25] = gridMin[1];
            highp[26] = gridMin[2];
            highp[27] = gridMin[3];
            // vertex: u_grid_max
            highp[28] = gridMax[0];
            highp[29] = gridMax[1];
            highp[30] = gridMax[2];
            highp[31] = gridMax[3];

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
            highp[3] = viewport[0];
            highp[7] = viewport[1];

            i = 12;
        }

        if (isStroke) {
            // vertex: u_half_width
            highp[i]     = halfWidth;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miterLimit;
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
     * @param isStroke
     * @param halfWidth
     * @param face
     * @param miterLimit
     * @param hasGrid
     * @param matrix
     * @param inverseMatrix
     * @param viewport
     * @param grid
     * @param textureWidth
     * @param textureHeight
     * @param mul1
     * @param mul2
     * @param mul3
     * @param mul4
     * @param add1
     * @param add2
     * @param add3
     * @param add4
     * @method
     * @public
     */
    setBitmapShapeUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, inverseMatrix, viewport, grid,
        textureWidth, textureHeight,
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
        highp[12] = inverseMatrix[0];
        highp[13] = inverseMatrix[1];
        highp[14] = inverseMatrix[2];

        highp[16] = inverseMatrix[3];
        highp[17] = inverseMatrix[4];
        highp[18] = inverseMatrix[5];

        highp[11] = inverseMatrix[6];
        highp[15] = inverseMatrix[7];
        highp[19] = inverseMatrix[8];

        // vertex: u_viewport
        highp[3] = viewport[0];
        highp[7] = viewport[1];

        i = 20;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[i]      = parentMatrix[0];
            highp[i + 1]  = parentMatrix[1];
            highp[i + 2]  = parentMatrix[2];

            highp[i + 4]  = parentMatrix[3];
            highp[i + 5]  = parentMatrix[4];
            highp[i + 6]  = parentMatrix[5];

            highp[i + 8]  = parentMatrix[6];
            highp[i + 9]  = parentMatrix[7];
            highp[i + 10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[i + 12] = ancestorMatrix[0];
            highp[i + 13] = ancestorMatrix[1];
            highp[i + 14] = ancestorMatrix[2];

            highp[i + 16] = ancestorMatrix[3];
            highp[i + 17] = ancestorMatrix[4];
            highp[i + 18] = ancestorMatrix[5];

            highp[i + 20] = ancestorMatrix[6];
            highp[i + 21] = ancestorMatrix[7];
            highp[i + 22] = ancestorMatrix[8];

            // vertex: u_parent_viewport
            highp[i + 11] = parentViewport[0];
            highp[i + 15] = parentViewport[1];
            highp[i + 19] = parentViewport[2];
            highp[i + 23] = parentViewport[3];

            // vertex: u_grid_min
            highp[i + 24] = gridMin[0];
            highp[i + 25] = gridMin[1];
            highp[i + 26] = gridMin[2];
            highp[i + 27] = gridMin[3];
            // vertex: u_grid_max
            highp[i + 28] = gridMax[0];
            highp[i + 29] = gridMax[1];
            highp[i + 30] = gridMax[2];
            highp[i + 31] = gridMax[3];

            i = 52;
        }

        if (isStroke) {
            // vertex: u_half_width
            highp[i]     = halfWidth;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miterLimit;
        }

        const mediump = uniform.mediump;

        // fragment: u_uv
        mediump[0] = textureWidth;
        mediump[1] = textureHeight;

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
     * @param hasGrid
     * @param matrix
     * @param viewport
     * @param grid
     * @method
     * @public
     */
    setMaskShapeUniform (uniform, hasGrid, matrix, viewport, grid)
    {
        const highp = uniform.highp;

        if (hasGrid) {
            const parentMatrix = grid._$parentMatrix;
            const ancestorMatrix = grid._$ancestorMatrix;
            const parentViewport = grid._$parentViewport;
            const gridMin = grid._$gridMin;
            const gridMax = grid._$gridMax;

            // vertex: u_parent_matrix
            highp[0]  = parentMatrix[0];
            highp[1]  = parentMatrix[1];
            highp[2]  = parentMatrix[2];

            highp[4]  = parentMatrix[3];
            highp[5]  = parentMatrix[4];
            highp[6]  = parentMatrix[5];

            highp[8]  = parentMatrix[6];
            highp[9]  = parentMatrix[7];
            highp[10] = parentMatrix[8];

            // vertex: u_ancestor_matrix
            highp[12] = ancestorMatrix[0];
            highp[13] = ancestorMatrix[1];
            highp[14] = ancestorMatrix[2];

            highp[16] = ancestorMatrix[3];
            highp[17] = ancestorMatrix[4];
            highp[18] = ancestorMatrix[5];

            highp[20] = ancestorMatrix[6];
            highp[21] = ancestorMatrix[7];
            highp[22] = ancestorMatrix[8];

            // vertex: u_viewport
            highp[3] = viewport[0];
            highp[7] = viewport[1];

            // vertex: u_parent_viewport
            highp[11] = parentViewport[0];
            highp[15] = parentViewport[1];
            highp[19] = parentViewport[2];
            highp[23] = parentViewport[3];

            // vertex: u_grid_min
            highp[24] = gridMin[0];
            highp[25] = gridMin[1];
            highp[26] = gridMin[2];
            highp[27] = gridMin[3];
            // vertex: u_grid_max
            highp[28] = gridMax[0];
            highp[29] = gridMax[1];
            highp[30] = gridMax[2];
            highp[31] = gridMax[3];
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
            highp[3] = viewport[0];
            highp[7] = viewport[1];
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
