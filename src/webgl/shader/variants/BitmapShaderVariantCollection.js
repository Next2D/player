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
        const key = `b`;

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
     * @param {WebGLShaderUniform} uniform
     * @public
     */
    setBitmapUniform (uniform)
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
     * @param {boolean}    useSourceTexture
     * @param {array}      srcTexMat
     * @param {BitmapData} alphaBitmapData
     * @param {array}      alphaTexMat
     * @public
     */
    setManipulatePixelsUniform (uniform, matrix, useSourceTexture, srcTexMat, alphaBitmapData, alphaTexMat)
    {
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

        if (alphaBitmapData) {
            // vertex: u_src_tex_matrix
            highp[12] = srcTexMat[0];
            highp[13] = srcTexMat[1];
            highp[14] = srcTexMat[2];

            highp[16] = srcTexMat[3];
            highp[17] = srcTexMat[4];
            highp[18] = srcTexMat[5];

            highp[20] = srcTexMat[6];
            highp[21] = srcTexMat[7];
            highp[22] = srcTexMat[8];

            // vertex: u_alpha_tex_matrix
            highp[24] = alphaTexMat[0];
            highp[25] = alphaTexMat[1];
            highp[26] = alphaTexMat[2];

            highp[3]  = alphaTexMat[3];
            highp[7]  = alphaTexMat[4];
            highp[11] = alphaTexMat[5];

            highp[15] = alphaTexMat[6];
            highp[19] = alphaTexMat[7];
            highp[23] = alphaTexMat[8];
        } else if (useSourceTexture) {
            // vertex: u_src_tex_matrix
            highp[12] = srcTexMat[0];
            highp[13] = srcTexMat[1];
            highp[14] = srcTexMat[2];

            highp[16] = srcTexMat[3];
            highp[17] = srcTexMat[4];
            highp[18] = srcTexMat[5];

            highp[3]  = srcTexMat[6];
            highp[7]  = srcTexMat[7];
            highp[11] = srcTexMat[8];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} sourceChannel
     * @param {number} destChannel
     * @public
     */
    setCopyChannelUniform (uniform, sourceChannel, destChannel)
    {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_src_ch
        mediump[0] =  sourceChannel       & 0x01;
        mediump[1] = (sourceChannel >> 1) & 0x01;
        mediump[2] = (sourceChannel >> 2) & 0x01;
        mediump[3] = (sourceChannel >> 3) & 0x01;
        // fragment: u_dst_ch
        mediump[4] =  destChannel       & 0x01;
        mediump[5] = (destChannel >> 1) & 0x01;
        mediump[6] = (destChannel >> 2) & 0x01;
        mediump[7] = (destChannel >> 3) & 0x01;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {WebGLTexture} alphaTex
     * @public
     */
    setCopyPixelsUniform (uniform, alphaTex)
    {
        if (alphaTex) {
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
     * @param {array}  texMatrix
     * @param {array}  texStep
     * @param {number} scanLoop
     * @param {array}  mask
     * @param {array}  color
     * @public
     */
    setGetColorBoundsRectUniform (uniform, texMatrix, texStep, scanLoop, mask, color)
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

        // vertex: u_tex_matrix
        highp[12] = texMatrix[0];
        highp[13] = texMatrix[1];
        highp[14] = texMatrix[2];

        highp[16] = texMatrix[3];
        highp[17] = texMatrix[4];
        highp[18] = texMatrix[5];

        highp[3]  = texMatrix[6];
        highp[7]  = texMatrix[7];
        highp[11] = texMatrix[8];

        const mediump = uniform.mediump;

        // fragment: u_src_tex_step
        mediump[0] = texStep[0];
        mediump[1] = texStep[1];

        // fragment: u_scan_loop
        mediump[2] = scanLoop;

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
     * @param {number} seedR
     * @param {number} seedG
     * @param {number} seedB
     * @param {number} seedA
     * @param {number} ampR
     * @param {number} ampG
     * @param {number} ampB
     * @param {number} ampA
     * @param {number} lowR
     * @param {number} lowG
     * @param {number} lowB
     * @param {number} lowA
     * @public
     */
    setNoiseUniform (
        uniform,
        seedR, seedG, seedB, seedA,
        ampR, ampG, ampB, ampA,
        lowR, lowG, lowB, lowA
    ) {
        const mediump = uniform.mediump;

        // fragment: u_seed
        mediump[0]  = seedR;
        mediump[1]  = seedG;
        mediump[2]  = seedB;
        mediump[3]  = seedA;

        // fragment: u_amp
        mediump[4]  = ampR;
        mediump[5]  = ampG;
        mediump[6]  = ampB;
        mediump[7]  = ampA;

        // fragment: u_low
        mediump[8]  = lowR;
        mediump[9]  = lowG;
        mediump[10] = lowB;
        mediump[11] = lowA;
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
    setThresholdUniform (uniform, tr, tg, tb, ta, cr, cg, cb, ca, mr, mg, mb, ma)
    {
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
