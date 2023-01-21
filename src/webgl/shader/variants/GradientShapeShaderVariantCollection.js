/**
 * @class
 */
class GradientShapeShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @constructor
     * @public
     */
    constructor (context, gl)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$collection = new Map();
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} has_grid
     * @param  {boolean} is_radial
     * @param  {boolean} has_focal_point
     * @param  {string}  spread_method
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getGradientShapeShader (
        is_stroke, has_grid, is_radial, has_focal_point, spread_method
    ) {

        const key = this.createCollectionKey(
            is_stroke, has_grid, is_radial, has_focal_point, spread_method
        );

        if (!this._$collection.has(key)) {
            let highpLength = (has_grid ? 13 : 5) + (is_stroke ? 1 : 0) + 1;
            const fragmentIndex = highpLength - 1;

            let vertexShaderSource;
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

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                vertexShaderSource,
                FragmentShaderSourceGradient.TEMPLATE(
                    highpLength, fragmentIndex,
                    is_radial, has_focal_point, spread_method
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} is_stroke
     * @param  {boolean} has_grid
     * @param  {boolean} is_radial
     * @param  {boolean} has_focal_point
     * @param  {string}  spread_method
     * @return {string}
     * @method
     * @private
     */
    createCollectionKey (is_stroke, has_grid, is_radial, has_focal_point, spread_method)
    {
        const key1 = is_stroke ? "y" : "n";
        const key2 = has_grid  ? "y" : "n";
        const key3 = is_radial ? "y" : "n";
        const key4 = is_radial && has_focal_point ? "y" : "n";
        let key5 = 0;
        switch (spread_method) {
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
     * @param {boolean} is_radial
     * @param {array}   points
     * @param {number}  focal_point_ratio
     * @method
     * @public
     */
    setGradientShapeUniform (
        uniform,
        is_stroke, half_width, face, miter_limit,
        has_grid, matrix, inverse_matrix,
        viewport_width, viewport_height, grid,
        is_radial, points, focal_point_ratio
    ) {
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

        let i = 20;
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

            i += 4;
        }

        if (is_radial) {
            // fragment: u_radial_point
            highp[i]     = points[5];
            // fragment: u_focal_point_ratio
            highp[i + 1] = focal_point_ratio;
        } else {
            // fragment: u_linear_points
            highp[i]     = points[0];
            highp[i + 1] = points[1];
            highp[i + 2] = points[2];
            highp[i + 3] = points[3];
        }
    }
}
