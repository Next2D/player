/**
 * @class
 */
class BlendShaderVariantCollection
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
     * @param  {boolean} with_color_transform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getNormalBlendShader (with_color_transform)
    {
        const key = `n${with_color_transform ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND(),
                FragmentShaderSourceTexture.TEMPLATE(with_color_transform)
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
        const key = "c";

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND_CLIP(),
                FragmentShaderSourceTexture.TEMPLATE(false)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {string}  operation
     * @param  {boolean} with_color_transform
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlendShader (operation, with_color_transform)
    {
        const key = `${operation}${with_color_transform ? "y" : "n"}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.BLEND(),
                FragmentShaderSourceBlend.TEMPLATE(operation, with_color_transform)
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
     * @param {number}  render_width
     * @param {number}  render_height
     * @param {boolean} with_color_transform
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
        uniform, x, y, w, h, matrix, render_width, render_height,
        with_color_transform, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7)
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
        highp[7]  = render_width;
        highp[11] = render_height;

        if (with_color_transform) {
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
     * @param {array}   inverse_matrix
     * @param {number}  render_width
     * @param {number}  render_height
     * @method
     * @public
     */
    setClipUniform (
        uniform, x, y, w, h, inverse_matrix, render_width, render_height
    ) {

        const highp = uniform.highp;

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
     * @param {WebGLShaderUniform} uniform
     * @param {number}  x
     * @param {number}  y
     * @param {number}  w
     * @param {number}  h
     * @param {array}   matrix
     * @param {number}  render_width
     * @param {number}  render_height
     * @param {boolean} with_color_transform
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
        uniform, x, y, w, h, matrix, render_width, render_height,
        with_color_transform, ct0, ct1, ct2, ct3, ct4, ct5, ct6, ct7
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
        highp[7]  = render_width;
        highp[11] = render_height;

        if (with_color_transform) {
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
