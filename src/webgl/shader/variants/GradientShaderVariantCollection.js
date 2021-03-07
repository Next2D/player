/**
 * @class
 */
class GradientShaderVariantCollection
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
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getGradientShader (isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace)
    {
        const key = this.createCollectionKey(isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace);
        
        if (!this._$collection.has(key)) {
            let highpLength = ((hasGrid) ? 13 : 5) + ((isStroke) ? 1 : 0);
            const fragmentIndex = highpLength;

            if (isRadial) {
                highpLength += Util.$ceil((stopsLength * 5 + ((hasFocalPoint) ? 2 : 1)) / 4);
            } else {
                highpLength += 1 + Util.$ceil((stopsLength * 5) / 4);
            }

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
                    isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace
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
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {string}
     * @method
     * @private
     */
    createCollectionKey (isStroke, hasGrid, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace)
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
        const key6 = ("0" + stopsLength).slice(-2);
        const key7 = (isLinearSpace) ? "y" : "n";

        return `${key1}${key2}${key3}${key4}${key5}${key6}${key7}`;
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
     * @param {array}   viewport
     * @param {CanvasToWebGLContextGrid} grid
     * @param {boolean} isRadial
     * @param {array}   points
     * @param {boolean} hasFocalPoint
     * @param {number}  focalPointRatio
     * @param {array}   stops
     * @param {number}  stopsLength
     * @param {boolean} isLinearSpace
     * @method
     * @public
     */
    setGradientUniform (
        uniform,
        isStroke, halfWidth, face, miterLimit,
        hasGrid, matrix, inverseMatrix, viewport, grid,
        isRadial, points, hasFocalPoint, focalPointRatio, stops, stopsLength, isLinearSpace
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

            i += 4;
        }

        if (!isRadial) {
            // fragment: u_linear_points
            highp[i]     = points[0];
            highp[i + 1] = points[1];
            highp[i + 2] = points[2];
            highp[i + 3] = points[3];

            i += 4;
        }

        const table = (isLinearSpace)
            ? Util.$rgbToLinearTable
            : Util.$rgbIdentityTable;
        // fragment: u_gradient_color
        for (let j = 0; j < stopsLength; j++) {
            const color = stops[j][1];
            highp[i]     = table[color[0]];
            highp[i + 1] = table[color[1]];
            highp[i + 2] = table[color[2]];
            highp[i + 3] = table[color[3]];

            i += 4;
        }
        // fragment: u_gradient_t
        for (let j = 0; j < stopsLength; j++) {
            highp[i++] = stops[j][0];
        }

        if (isRadial) {
            // fragment: u_radial_point
            highp[i++] = points[5];
            if (hasFocalPoint) {
                // fragment: u_focal_point_ratio
                highp[i++] = focalPointRatio;
            }
        }
    }
}
