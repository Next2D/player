/**
 * @class
 */
class FilterShaderVariantCollection
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
     * @param  {number}  halfBlur
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlurFilterShader (halfBlur)
    {
        const key = `b${halfBlur}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceBlurFilter.TEMPLATE(this._$keyword, halfBlur)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} transformsBase
     * @param  {boolean} transformsBlur
     * @param  {boolean} isGlow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {boolean} appliesStrength
     * @param  {number}  gradientStopsLength
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapFilterShader (transformsBase, transformsBlur, isGlow, type, knockout, appliesStrength, gradientStopsLength)
    {
        const key1 = (transformsBase) ? "y" : "n";
        const key2 = (transformsBlur) ? "y" : "n";
        const key3 = (isGlow) ? "y" : "n";
        const key4 = (knockout) ? "y" : "n";
        const key5 = (appliesStrength) ? "y" : "n";
        const key = `f${key1}${key2}${key3}${type}${key4}${key5}${gradientStopsLength}`;

        if (!this._$collection.has(key)) {
            const texturesLength = (transformsBase) ? 2 : 1;
            let mediumpLength = ((transformsBase) ? 4 : 0)
                + ((transformsBlur) ? 4 : 0)
                + ((appliesStrength) ? 1 : 0);
            if (gradientStopsLength > 0) {
                mediumpLength += gradientStopsLength * 5;
            } else {
                mediumpLength += (isGlow) ? 4 : 8;
            }
            mediumpLength = Util.$ceil(mediumpLength / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceFilter.TEMPLATE(
                    this._$keyword, texturesLength, mediumpLength,
                    transformsBase, transformsBlur,
                    isGlow, type, knockout,
                    appliesStrength, gradientStopsLength
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getColorMatrixFilterShader ()
    {
        const key = `m`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceColorMatrixFilter.TEMPLATE(this._$keyword)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {number}  x
     * @param  {number}  y
     * @param  {boolean} preserveAlpha
     * @param  {boolean} clamp
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getConvolutionFilterShader (x, y, preserveAlpha, clamp)
    {
        const key1 = ("0" + x).slice(-2);
        const key2 = ("0" + y).slice(-2);
        const key3 = (preserveAlpha) ? "y" : "n";
        const key4 = (clamp) ? "y" : "n";
        const key = `c${key1}${key2}${key3}${key4}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = ((clamp) ? 1 : 2) + Util.$ceil((x * y) / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceConvolutionFilter.TEMPLATE(
                    this._$keyword, mediumpLength,
                    x, y, preserveAlpha, clamp
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {number} componentX
     * @param  {number} componentY
     * @param  {string} mode
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getDisplacementMapFilterShader (componentX, componentY, mode)
    {
        const key = `d${componentX}${componentY}${mode}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = (mode === DisplacementMapFilterMode.COLOR) ? 3 : 2;

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceDisplacementMapFilter.TEMPLATE(
                    this._$keyword, mediumpLength,
                    componentX, componentY, mode
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {boolean} isHorizontal
     * @param {number}  fraction
     * @param {number}  samples
     * @method
     * @public
     */
    setBlurFilterUniform (uniform, width, height, isHorizontal, fraction, samples)
    {
        const mediump = uniform.mediump;

        // fragment: u_offset
        if (isHorizontal) {
            mediump[0] = 1 / width;
            mediump[1] = 0;
        } else {
            mediump[0] = 0;
            mediump[1] = 1 / height;
        }

        // fragment: u_fraction
        mediump[2] = fraction;

        // fragment: u_samples
        mediump[3] = samples;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {number}  baseWidth
     * @param {number}  baseHeight
     * @param {number}  baseOffsetX
     * @param {number}  baseOffsetY
     * @param {number}  blurWidth
     * @param {number}  blurHeight
     * @param {number}  blurOffsetX
     * @param {number}  blurOffsetY
     * @param {boolean} isGlow
     * @param {number}  strength
     * @param {array}   ratios
     * @param {array}   colors1
     * @param {array}   colors2
     * @param {boolean} transformsBase
     * @param {boolean} transformsBlur
     * @param {boolean} appliesStrength
     * @param {number}  gradientStopsLength
     * @method
     * @public
     */
    setBitmapFilterUniform (
        uniform, width, height,
        baseWidth, baseHeight, baseOffsetX, baseOffsetY,
        blurWidth, blurHeight, blurOffsetX, blurOffsetY,
        isGlow, strength, ratios, colors1, colors2,
        transformsBase, transformsBlur, appliesStrength, gradientStopsLength
    ) {
        if (transformsBase) {
            // fragment: u_textures
            const textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 1;
        }

        const mediump = uniform.mediump;
        let i = 0;

        if (transformsBase) {
            // fragment: u_uv_scale
            mediump[i]     = width / baseWidth;
            mediump[i + 1] = height / baseHeight;
            // fragment: u_uv_offset
            mediump[i + 2] = baseOffsetX / baseWidth;
            mediump[i + 3] = (height - baseHeight - baseOffsetY) / baseHeight;
            i += 4;
        }

        if (transformsBlur) {
            // fragment: u_st_scale
            mediump[i]     = width / blurWidth;
            mediump[i + 1] = height / blurHeight;
            // fragment: u_st_offset
            mediump[i + 2] = blurOffsetX / blurWidth;
            mediump[i + 3] = (height - blurHeight - blurOffsetY) / blurHeight;
            i += 4;
        }

        if (gradientStopsLength > 0) {
            // fragment: u_gradient_color
            for (let j = 0; j < gradientStopsLength; j++) {
                const color1 = colors1[j];
                mediump[i]     = ((color1 >> 16)       ) / 255;
                mediump[i + 1] = ((color1 >>  8) & 0xFF) / 255;
                mediump[i + 2] = ( color1        & 0xFF) / 255;
                mediump[i + 3] = colors2[j];
                i += 4;
            }
            // fragment: u_gradient_t
            for (let j = 0; j < gradientStopsLength; j++) {
                mediump[i++] = ratios[j];
            }
        } else if (isGlow) {
            // fragment: u_color
            mediump[i]     = colors1[0];
            mediump[i + 1] = colors1[1];
            mediump[i + 2] = colors1[2];
            mediump[i + 3] = colors1[3];
            i += 4;
        } else {
            // fragment: u_highlight_color
            mediump[i]     = colors1[0];
            mediump[i + 1] = colors1[1];
            mediump[i + 2] = colors1[2];
            mediump[i + 3] = colors1[3];
            // fragment: u_shadow_color
            mediump[i + 4] = colors2[0];
            mediump[i + 5] = colors2[1];
            mediump[i + 6] = colors2[2];
            mediump[i + 7] = colors2[3];
            i+= 8;
        }

        if (appliesStrength) {
            // fragment: u_strength
            mediump[i++] = strength;
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array} matrix
     * @method
     * @public
     */
    setColorMatrixFilterUniform (uniform, matrix)
    {
        const mediump = uniform.mediump;

        // fragment: u_mul
        mediump[0]  = matrix[0];
        mediump[1]  = matrix[1];
        mediump[2]  = matrix[2];
        mediump[3]  = matrix[3];

        mediump[4]  = matrix[5];
        mediump[5]  = matrix[6];
        mediump[6]  = matrix[7];
        mediump[7]  = matrix[8];

        mediump[8]  = matrix[10];
        mediump[9]  = matrix[11];
        mediump[10] = matrix[12];
        mediump[11] = matrix[13];

        mediump[12] = matrix[15];
        mediump[13] = matrix[16];
        mediump[14] = matrix[17];
        mediump[15] = matrix[18];

        // fragment: u_add
        mediump[16] = matrix[4]  / 255;
        mediump[17] = matrix[9]  / 255;
        mediump[18] = matrix[14] / 255;
        mediump[19] = matrix[19] / 255;
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {array}   matrix
     * @param {number}  divisor
     * @param {number}  bias
     * @param {boolean} clamp
     * @param {array}   color
     * @method
     * @public
     */
    setConvolutionFilterUniform (uniform, width, height, matrix, divisor, bias, clamp, color)
    {
        const mediump = uniform.mediump;

        // fragment: u_rcp_size
        mediump[0] = 1 / width;
        mediump[1] = 1 / height;

        // fragment: u_rcp_divisor
        mediump[2] = 1 / divisor;

        // fragment: u_bias
        mediump[3] = bias / 255;

        let i = 4;

        if (!clamp) {
            // fragment: u_substitute_color
            mediump[i]     = color[0];
            mediump[i + 1] = color[1];
            mediump[i + 2] = color[2];
            mediump[i + 3] = color[3];
            i += 4;
        }

        // fragment: u_matrix
        const length = matrix.length;
        for (let j = 0; j < length; j++) {
            mediump[i++] = matrix[j];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number} mapWidth
     * @param {number} mapHeight
     * @param {number} baseWidth
     * @param {number} baseHeight
     * @param {number} pointX
     * @param {number} pointY
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {string} mode
     * @param {array}  color
     * @method
     * @public
     */
    setDisplacementMapFilterUniform (
        uniform, mapWidth, mapHeight, baseWidth, baseHeight,
        pointX, pointY, scaleX, scaleY, mode, color
    ) {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_uv_to_st_scale
        mediump[0] = baseWidth  / mapWidth;
        mediump[1] = baseHeight / mapHeight;
        // fragment: u_uv_to_st_offset
        mediump[2] = pointX / mapWidth;
        mediump[3] = (baseHeight - mapHeight - pointY) / mapHeight;

        // fragment: u_scale
        mediump[4] =  scaleX / baseWidth;
        mediump[5] = -scaleY / baseHeight;

        if (mode === DisplacementMapFilterMode.COLOR) {
            // fragment: u_substitute_color
            mediump[8]  = color[0];
            mediump[9]  = color[1];
            mediump[10] = color[2];
            mediump[11] = color[3];
        }
    }
}
