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
     * @param  {number}  half_blur
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBlurFilterShader (half_blur)
    {
        const key = `b${half_blur}`;

        if (!this._$collection.has(key)) {
            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceBlurFilter.TEMPLATE(this._$keyword, half_blur)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {boolean} transforms_base
     * @param  {boolean} transforms_blur
     * @param  {boolean} is_glow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {boolean} applies_strength
     * @param  {boolean} is_gradient
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getBitmapFilterShader (
        transforms_base, transforms_blur, is_glow,
        type, knockout, applies_strength, is_gradient
    ) {

        const key1 = transforms_base ? "y" : "n";
        const key2 = transforms_blur ? "y" : "n";
        const key3 = is_glow ? "y" : "n";
        const key4 = knockout ? "y" : "n";
        const key5 = applies_strength ? "y" : "n";
        const key = `f${key1}${key2}${key3}${type}${key4}${key5}`;

        if (!this._$collection.has(key)) {
            let texturesLength = 1;
            if (transforms_base) { texturesLength++ }
            if (is_gradient) { texturesLength++ }

            let mediumpLength = (transforms_base ? 4 : 0)
                + (transforms_blur ? 4 : 0)
                + (applies_strength ? 1 : 0);
            if (is_gradient) {
                // do nothing
            } else {
                mediumpLength += is_glow ? 4 : 8;
            }
            mediumpLength = Math.ceil(mediumpLength / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceFilter.TEMPLATE(
                    this._$keyword, texturesLength, mediumpLength,
                    transforms_base, transforms_blur,
                    is_glow, type, knockout,
                    applies_strength, is_gradient
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
        const key = "m";

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
     * @param  {boolean} preserve_alpha
     * @param  {boolean} clamp
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getConvolutionFilterShader (x, y, preserve_alpha, clamp)
    {
        const key1 = ("0" + x).slice(-2);
        const key2 = ("0" + y).slice(-2);
        const key3 = preserve_alpha ? "y" : "n";
        const key4 = clamp ? "y" : "n";
        const key = `c${key1}${key2}${key3}${key4}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = (clamp ? 1 : 2) + Math.ceil(x * y / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceConvolutionFilter.TEMPLATE(
                    this._$keyword, mediumpLength,
                    x, y, preserve_alpha, clamp
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param  {number} component_x
     * @param  {number} component_y
     * @param  {string} mode
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getDisplacementMapFilterShader (component_x, component_y, mode)
    {
        const key = `d${component_x}${component_y}${mode}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = mode === DisplacementMapFilterMode.COLOR ? 3 : 2;

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceDisplacementMapFilter.TEMPLATE(
                    this._$keyword, mediumpLength,
                    component_x, component_y, mode
                )
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {number}  width
     * @param {number}  height
     * @param {boolean} is_horizontal
     * @param {number}  fraction
     * @param {number}  samples
     * @method
     * @public
     */
    setBlurFilterUniform (uniform, width, height, is_horizontal, fraction, samples)
    {
        const mediump = uniform.mediump;

        // fragment: u_offset
        if (is_horizontal) {
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
     * @param {number}  base_width
     * @param {number}  base_height
     * @param {number}  base_offset_x
     * @param {number}  base_offset_y
     * @param {number}  blur_width
     * @param {number}  blur_height
     * @param {number}  blur_offset_x
     * @param {number}  blur_offset_y
     * @param {boolean} is_glow
     * @param {number}  strength
     * @param {number}  color_r1
     * @param {number}  color_g1
     * @param {number}  color_b1
     * @param {number}  color_a1
     * @param {number}  color_r2
     * @param {number}  color_g2
     * @param {number}  color_b2
     * @param {number}  color_a2
     * @param {boolean} transforms_base
     * @param {boolean} transforms_blur
     * @param {boolean} applies_strength
     * @param {boolean} is_gradient
     * @method
     * @public
     */
    setBitmapFilterUniform (
        uniform, width, height,
        base_width, base_height, base_offset_x, base_offset_y,
        blur_width, blur_height, blur_offset_x, blur_offset_y,
        is_glow, strength,
        color_r1, color_g1, color_b1, color_a1,
        color_r2, color_g2, color_b2, color_a2,
        transforms_base, transforms_blur, applies_strength, is_gradient
    ) {
        let textures;
        // fragment: u_textures
        if (transforms_base) {
            textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 1;
            if (is_gradient) {
                textures[2] = 2;
            }
        } else if (is_gradient) {
            textures = uniform.textures;
            textures[0] = 0;
            textures[1] = 2;
        }

        const mediump = uniform.mediump;
        let i = 0;

        if (transforms_base) {
            // fragment: u_uv_scale
            mediump[i]     = width / base_width;
            mediump[i + 1] = height / base_height;
            // fragment: u_uv_offset
            mediump[i + 2] = base_offset_x / base_width;
            mediump[i + 3] = (height - base_height - base_offset_y) / base_height;
            i += 4;
        }

        if (transforms_blur) {
            // fragment: u_st_scale
            mediump[i]     = width / blur_width;
            mediump[i + 1] = height / blur_height;
            // fragment: u_st_offset
            mediump[i + 2] = blur_offset_x / blur_width;
            mediump[i + 3] = (height - blur_height - blur_offset_y) / blur_height;
            i += 4;
        }

        if (is_gradient) {
            // do nothing
        } else if (is_glow) {
            // fragment: u_color
            mediump[i]     = color_r1;
            mediump[i + 1] = color_g1;
            mediump[i + 2] = color_b1;
            mediump[i + 3] = color_a1;
            i += 4;
        } else {
            // fragment: u_highlight_color
            mediump[i]     = color_r1;
            mediump[i + 1] = color_g1;
            mediump[i + 2] = color_b1;
            mediump[i + 3] = color_a1;
            // fragment: u_shadow_color
            mediump[i + 4] = color_r2;
            mediump[i + 5] = color_g2;
            mediump[i + 6] = color_b2;
            mediump[i + 7] = color_a2;
            i += 8;
        }

        if (applies_strength) {
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
     * @param {number}  color_r
     * @param {number}  color_g
     * @param {number}  color_b
     * @param {number}  color_a
     * @method
     * @public
     */
    setConvolutionFilterUniform (
        uniform,
        width, height, matrix, divisor, bias, clamp,
        color_r, color_g, color_b, color_a
    ) {
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
            mediump[i]     = color_r;
            mediump[i + 1] = color_g;
            mediump[i + 2] = color_b;
            mediump[i + 3] = color_a;
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
     * @param {number} map_width
     * @param {number} map_height
     * @param {number} base_width
     * @param {number} base_height
     * @param {number} point_x
     * @param {number} point_y
     * @param {number} scale_x
     * @param {number} scale_y
     * @param {string} mode
     * @param {number} color_r
     * @param {number} color_g
     * @param {number} color_b
     * @param {number} color_a
     * @method
     * @public
     */
    setDisplacementMapFilterUniform (
        uniform, map_width, map_height, base_width, base_height,
        point_x, point_y, scale_x, scale_y, mode,
        color_r, color_g, color_b, color_a
    ) {
        const textures = uniform.textures;
        textures[0] = 0;
        textures[1] = 1;

        const mediump = uniform.mediump;

        // fragment: u_uv_to_st_scale
        mediump[0] = base_width  / map_width;
        mediump[1] = base_height / map_height;
        // fragment: u_uv_to_st_offset
        mediump[2] = point_x / map_width;
        mediump[3] = (base_height - map_height - point_y) / map_height;

        // fragment: u_scale
        mediump[4] =  scale_x / base_width;
        mediump[5] = -scale_y / base_height;

        if (mode === DisplacementMapFilterMode.COLOR) {
            // fragment: u_substitute_color
            mediump[8]  = color_r;
            mediump[9]  = color_g;
            mediump[10] = color_b;
            mediump[11] = color_a;
        }
    }
}