/**
 * @class
 */
class GradientShapeShaderVariantCollection
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
     * @param  {boolean} isRadial
     * @param  {boolean} hasFocalPoint
     * @param  {string}  spreadMethod
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getGradientShapeShader (isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod)
    {
        const key = this.createCollectionKey(isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod);

        if (!this._$collection.has(key)) {
            let highpLength = ((hasGrid) ? 13 : 5) + ((isStroke) ? 1 : 0) + 1;
            const fragmentIndex = highpLength - 1;
 
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

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSourceGradient.TEMPLATE(
                    this._$keyword, highpLength, fragmentIndex,
                    isRadial, hasFocalPoint, spreadMethod
                )
            ));
        }
        
        return this._$collection.get(key);
    }
 
    /**
     * @param  {boolean} isStroke
     * @param  {boolean} hasGrid
     * @param  {boolean} isRadial
     * @param  {boolean} hasFocalPoint
     * @param  {string}  spreadMethod
     * @return {string}
     * @method
     * @private
     */
    createCollectionKey (isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod)
    {
        const key1 = (isStroke) ? "y" : "n";
        const key2 = (hasGrid) ? "y" : "n";
        const key3 = (isRadial) ? "y" : "n";
        const key4 = (isRadial && hasFocalPoint) ? "y" : "n";
        let key5 = 0;
        switch (spreadMethod) {
            case "reflect":
                key5 = 1;
                break;
            case "repeat":
                key5 = 2;
                break;
        }

        return `${key1}${key2}${key3}${key4}${key5}`;
    }
 
    /**
     * @param {WebGLShaderUniform} uniform
     * @param {boolean} isStroke
     * @param {number}  halfWidth
     * @param {number}  face
     * @param {number}  miterLimit
     * @param {boolean} hasGrid
     * @param {array}   matrix
     * @param {array}   inverseMatrix
     * @param {number}  viewportWidth
     * @param {number}  viewportHeight
     * @param {CanvasToWebGLContextGrid} grid
     * @param {boolean} isRadial
     * @param {array}   points
     * @param {number}  focalPointRatio
     * @method
     * @public
     */
    setGradientShapeUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, inverseMatrix,
        viewportWidth, viewportHeight, grid,
        isRadial, points, focalPointRatio
    ) {
        let i = 0;
        const highp = uniform.highp;

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
        highp[3] = viewportWidth;
        highp[7] = viewportHeight;

        i = 20;

        if (hasGrid) {
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

        if (isStroke) {
            // vertex: u_half_width
            highp[i]     = halfWidth;
            // vertex: u_face
            highp[i + 1] = face;
            // vertex: u_miter_limit
            highp[i + 2] = miterLimit;

            i += 4;
        }

        if (isRadial) {
            // fragment: u_radial_point
            highp[i]     = points[5];
            // fragment: u_focal_point_ratio
            highp[i + 1] = focalPointRatio;
        } else {
            // fragment: u_linear_points
            highp[i]     = points[0];
            highp[i + 1] = points[1];
            highp[i + 2] = points[2];
            highp[i + 3] = points[3];
        }
    }
}
