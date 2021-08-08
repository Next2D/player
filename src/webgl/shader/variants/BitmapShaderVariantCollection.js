/**
 * @class
 */
class BitmapShaderVariantCollection
{
    /**
     * @param {CanvasToWebGLContext}  context
     * @param {WebGLRenderingContext} gl
     * @param {WebGLShaderKeyword}    keyword
     * @constructor
     */
    constructor (context, gl, keyword)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$keyword    = keyword;
        this._$collection = new Map();
    }

    /**
     * @return {CanvasToWebGLShader}
     * @public
     */
    getBitmapShader ()
    {
        const key = "b";

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceTexture.TEMPLATE(this._$keyword, 0, 0, false)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @public
     */
    setBitmapUniform ()
    {
        // uniform設定不要
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} sx
     * @param {number} sy
     * @param {number} tx
     * @param {number} ty
     * @public
     */
    setGetPixelsUniform (uniform, sx, sy, tx, ty)
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

        // vertex: u_src_tex_matrix
        highp[12] = sx;
        highp[13] = 0;
        highp[14] = 0;

        highp[16] = 0;
        highp[17] = sy;
        highp[18] = 0;

        highp[3]  = tx;
        highp[7]  = ty;
        highp[11] = 1;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} sx1
     * @param {number} sy1
     * @param {number} tx1
     * @param {number} ty1
     * @param {number} sx2
     * @param {number} sy2
     * @param {number} tx2
     * @param {number} ty2
     * @public
     */
    setSetPixelsUniform (uniform, sx1, sy1, tx1, ty1, sx2, sy2, tx2, ty2)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0]  = sx1;
        highp[1]  = 0;
        highp[2]  = 0;

        highp[4]  = 0;
        highp[5]  = sy1;
        highp[6]  = 0;

        highp[8]  = tx1;
        highp[9]  = ty1;
        highp[10] = 1;

        // vertex: u_src_tex_matrix
        highp[12] = sx2;
        highp[13] = 0;
        highp[14] = 0;

        highp[16] = 0;
        highp[17] = sy2;
        highp[18] = 0;

        highp[3]  = tx2;
        highp[7]  = ty2;
        highp[11] = 1;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array} colorTransform
     * @public
     */
    setColorTransformUniform (uniform, colorTransform)
    {
        const mediump = uniform.mediump;

        // fragment: u_color_transform_mul
        mediump[0] = colorTransform[0];
        mediump[1] = colorTransform[1];
        mediump[2] = colorTransform[2];
        mediump[3] = colorTransform[3];
        // fragment: u_color_transform_add
        mediump[4] = colorTransform[4] / 255;
        mediump[5] = colorTransform[5] / 255;
        mediump[6] = colorTransform[6] / 255;
        mediump[7] = colorTransform[7] / 255;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array}      matrix
     * @param {boolean}    use_source_texture
     * @param {array}      src_tex_mat
     * @param {BitmapData} alpha_bitmap_data
     * @param {array}      alpha_tex_mat
     * @public
     */
    setManipulatePixelsUniform (
        uniform, matrix, use_source_texture,
        src_tex_mat, alpha_bitmap_data, alpha_tex_mat
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

        if (alpha_bitmap_data) {
            // vertex: u_src_tex_matrix
            highp[12] = src_tex_mat[0];
            highp[13] = src_tex_mat[1];
            highp[14] = src_tex_mat[2];

            highp[16] = src_tex_mat[3];
            highp[17] = src_tex_mat[4];
            highp[18] = src_tex_mat[5];

            highp[20] = src_tex_mat[6];
            highp[21] = src_tex_mat[7];
            highp[22] = src_tex_mat[8];

            // vertex: u_alpha_tex_matrix
            highp[24] = alpha_tex_mat[0];
            highp[25] = alpha_tex_mat[1];
            highp[26] = alpha_tex_mat[2];

            highp[3]  = alpha_tex_mat[3];
            highp[7]  = alpha_tex_mat[4];
            highp[11] = alpha_tex_mat[5];

            highp[15] = alpha_tex_mat[6];
            highp[19] = alpha_tex_mat[7];
            highp[23] = alpha_tex_mat[8];
        } else if (use_source_texture) {
            // vertex: u_src_tex_matrix
            highp[12] = src_tex_mat[0];
            highp[13] = src_tex_mat[1];
            highp[14] = src_tex_mat[2];

            highp[16] = src_tex_mat[3];
            highp[17] = src_tex_mat[4];
            highp[18] = src_tex_mat[5];

            highp[3]  = src_tex_mat[6];
            highp[7]  = src_tex_mat[7];
            highp[11] = src_tex_mat[8];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} source_channel
     * @param {number} dest_channel
     * @public
     */
    setCopyChannelUniform (uniform, source_channel, dest_channel)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_src_ch
        mediump[0] = source_channel      & 0x01;
        mediump[1] = source_channel >> 1 & 0x01;
        mediump[2] = source_channel >> 2 & 0x01;
        mediump[3] = source_channel >> 3 & 0x01;
        // fragment: u_dst_ch
        mediump[4] = dest_channel      & 0x01;
        mediump[5] = dest_channel >> 1 & 0x01;
        mediump[6] = dest_channel >> 2 & 0x01;
        mediump[7] = dest_channel >> 3 & 0x01;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {WebGLTexture} alpha_tex
     * @public
     */
    setCopyPixelsUniform (uniform, alpha_tex)
    {
        if (alpha_tex) {
            const textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 1;
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @public
     */
    setFillRectUniform (uniform, r, g, b, a)
    {
        const mediump = uniform.mediump;

        // fragment: u_color
        mediump[0] = r;
        mediump[1] = g;
        mediump[2] = b;
        mediump[3] = a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array}  tex_matrix
     * @param {array}  tex_step
     * @param {number} scan_loop
     * @param {array}  mask
     * @param {array}  color
     * @public
     */
    setGetColorBoundsRectUniform (
        uniform, tex_matrix, tex_step, scan_loop, mask, color
    ) {

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

        // vertex: u_tex_matrix
        highp[12] = tex_matrix[0];
        highp[13] = tex_matrix[1];
        highp[14] = tex_matrix[2];

        highp[16] = tex_matrix[3];
        highp[17] = tex_matrix[4];
        highp[18] = tex_matrix[5];

        highp[3]  = tex_matrix[6];
        highp[7]  = tex_matrix[7];
        highp[11] = tex_matrix[8];

        const mediump = uniform.mediump;

        // fragment: u_src_tex_step
        mediump[0] = tex_step[0];
        mediump[1] = tex_step[1];

        // fragment: u_scan_loop
        mediump[2] = scan_loop;

        const integer = uniform.integer;

        // fragment: u_mask
        integer[0] = mask[0];
        integer[1] = mask[1];
        integer[2] = mask[2];
        integer[3] = mask[3];

        // fragment: u_color
        integer[4] = color[0];
        integer[5] = color[1];
        integer[6] = color[2];
        integer[7] = color[3];
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @public
     */
    setMergeUniform (uniform, r, g, b, a)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_multipliers
        mediump[0] = r;
        mediump[1] = g;
        mediump[2] = b;
        mediump[3] = a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} seed_r
     * @param {number} seed_g
     * @param {number} seed_b
     * @param {number} seed_a
     * @param {number} amp_r
     * @param {number} amp_g
     * @param {number} amp_b
     * @param {number} amp_a
     * @param {number} low_r
     * @param {number} low_g
     * @param {number} low_b
     * @param {number} low_a
     * @public
     */
    setNoiseUniform (
        uniform,
        seed_r, seed_g, seed_b, seed_a,
        amp_r, amp_g, amp_b, amp_a,
        low_r, low_g, low_b, low_a
    ) {
        const mediump = uniform.mediump;

        // fragment: u_seed
        mediump[0]  = seed_r;
        mediump[1]  = seed_g;
        mediump[2]  = seed_b;
        mediump[3]  = seed_a;

        // fragment: u_amp
        mediump[4]  = amp_r;
        mediump[5]  = amp_g;
        mediump[6]  = amp_b;
        mediump[7]  = amp_a;

        // fragment: u_low
        mediump[8]  = low_r;
        mediump[9]  = low_g;
        mediump[10] = low_b;
        mediump[11] = low_a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @public
     */
    setPaletteMapUniform (uniform)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 2;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @param {number} a
     * @public
     */
    setPixelDissolveUniform (uniform, r, g, b, a)
    {
        const mediump = uniform.mediump;

        // fragment: u_color
        mediump[0] = r;
        mediump[1] = g;
        mediump[2] = b;
        mediump[3] = a;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @public
     */
    setFlushSetPixelQueueUniform (uniform)
    {
        const highp = uniform.highp;

        // vertex: u_matrix
        highp[0] = 1;
        highp[1] = 0;
        highp[2] = 0;

        highp[3] = 0;
        highp[4] = -1;
        highp[5] = 0;

        highp[6] = 0;
        highp[7] = 1;
        highp[8] = 1;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} tr
     * @param {number} tg
     * @param {number} tb
     * @param {number} ta
     * @param {number} cr
     * @param {number} cg
     * @param {number} cb
     * @param {number} ca
     * @param {number} mr
     * @param {number} mg
     * @param {number} mb
     * @param {number} ma
     * @public
     */
    setThresholdUniform (
        uniform, tr, tg, tb, ta, cr, cg, cb, ca, mr, mg, mb, ma
    ) {

        const mediump = uniform.mediump;

        // fragment: u_threshold
        mediump[0] = tr;
        mediump[1] = tg;
        mediump[2] = tb;
        mediump[3] = ta;

        // fragment: u_out_color
        mediump[4] = cr;
        mediump[5] = cg;
        mediump[6] = cb;
        mediump[7] = ca;

        const integer = uniform.integer;

        // fragment: u_masked
        integer[0] = mr;
        integer[1] = mg;
        integer[2] = mb;
        integer[3] = ma;
    }
}