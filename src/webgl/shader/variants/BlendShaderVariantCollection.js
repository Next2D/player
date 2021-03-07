/**
 * @class
 */
class BlendShaderVariantCollection
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
     * @param  {boolean} withColorTransform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getNormalBlendShader (withColorTransform)
    {
        const key = `n${(withColorTransform) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND(this._$keyword),
                FragmentShaderSourceTexture.TEMPLATE(this._$keyword, withColorTransform)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getClipShader ()
    {
        const key = `c`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND_CLIP(this._$keyword),
                FragmentShaderSourceTexture.TEMPLATE(this._$keyword, false)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {string} operation
     * @param  {boolean} withColorTransform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlendShader (operation, withColorTransform)
    {
        const key = `${operation}${(withColorTransform) ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND(this._$keyword),
                FragmentShaderSourceBlend.TEMPLATE(this._$keyword, operation, withColorTransform)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   matrix
     * @param {number}  renderWidth
     * @param {number}  renderHeight
     * @param {boolean} withCT
     * @param {number}  ct0
     * @param {number}  ct1
     * @param {number}  ct2
     * @param {number}  ct3
     * @param {number}  ct4
     * @param {number}  ct5
     * @param {number}  ct6
     * @param {number}  ct7
     * @method
     * @public
     */
    setNormalBlendUniform (
        uniform, x, y, w, h, matrix, renderWidth, renderHeight,
        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7)
    {
        const highp = uniform.highp;

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
        highp[7]  = renderWidth;
        highp[11] = renderHeight;

        if (withCT) {
            const mediump = uniform.mediump;

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
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   inverseMatrix
     * @param {number}  renderWidth
     * @param {number}  renderHeight
     * @method
     * @public
     */
    setClipUniform (uniform, x, y, w, h, inverseMatrix, renderWidth, renderHeight)
    {
        const highp = uniform.highp;

        // vertex: u_offset
        highp[0] = x;
        highp[1] = y;
        // vertex: u_size
        highp[2] = w;
        highp[3] = h;

        // vertex: u_inverse_matrix
        highp[4]  = inverseMatrix[0];
        highp[5]  = inverseMatrix[1];
        highp[6]  = inverseMatrix[2];

        highp[8]  = inverseMatrix[3];
        highp[9]  = inverseMatrix[4];
        highp[10] = inverseMatrix[5];

        highp[12] = inverseMatrix[6];
        highp[13] = inverseMatrix[7];
        highp[14] = inverseMatrix[8];

        // vertex: u_viewport
        highp[7]  = renderWidth;
        highp[11] = renderHeight;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   matrix
     * @param {number}  renderWidth
     * @param {number}  renderHeight
     * @param {boolean} withCT
     * @param {number}  ct0
     * @param {number}  ct1
     * @param {number}  ct2
     * @param {number}  ct3
     * @param {number}  ct4
     * @param {number}  ct5
     * @param {number}  ct6
     * @param {number}  ct7
     * @method
     * @public
     */
    setBlendUniform (
        uniform, x, y, w, h, matrix, renderWidth, renderHeight,
        withCT, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
    ) {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const highp = uniform.highp;

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
        highp[7]  = renderWidth;
        highp[11] = renderHeight;

        if (withCT) {
            const mediump = uniform.mediump;

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
