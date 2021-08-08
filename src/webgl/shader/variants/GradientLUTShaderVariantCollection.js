/**
 * @class
 */
class GradientLUTShaderVariantCollection
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
     * @param  {number}  stops_length
     * @param  {boolean} is_linear_space
     * @return {CanvasToWebGLShader}
     * @method
     * @public
     */
    getGradientLUTShader (stops_length, is_linear_space)
    {
        const key1 = ("00" + stops_length).slice(-3);
        const key2 = is_linear_space ? "y" : "n";
        const key = `l${key1}${key2}`;

        if (!this._$collection.has(key)) {
            const mediumpLength = Util.$ceil(stops_length * 5 / 4);

            this._$collection.set(key, new CanvasToWebGLShader(
                this._$gl, this._$context,
                VertexShaderSource.TEXTURE(this._$keyword),
                FragmentShaderSourceGradientLUT.TEMPLATE(this._$keyword, mediumpLength, stops_length, is_linear_space)
            ));
        }

        return this._$collection.get(key);
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array}  stops
     * @param {number} begin
     * @param {number} end
     * @param {array}  table
     * @method
     * @public
     */
    setGradientLUTUniformForShape (uniform, stops, begin, end, table)
    {
        let i = 0;
        const mediump = uniform.mediump;

        // fragment: u_gradient_color
        for (let j = begin; j < end; j++) {
            const color = stops[j][1];
            mediump[i++] = table[color[0]];
            mediump[i++] = table[color[1]];
            mediump[i++] = table[color[2]];
            mediump[i++] = table[color[3]];
        }

        // fragment: u_gradient_t
        for (let j = begin; j < end; j++) {
            mediump[i++] = stops[j][0];
        }
    }

    /**
     * @param {WebGLShaderUniform} uniform
     * @param {array}  ratios
     * @param {array}  colors
     * @param {array}  alphas
     * @param {number} begin
     * @param {number} end
     * @method
     * @public
     */
    setGradientLUTUniformForFilter (uniform, ratios, colors, alphas, begin, end)
    {
        let i = 0;
        const mediump = uniform.mediump;

        // fragment: u_gradient_color
        for (let j = begin; j < end; j++) {
            const color = colors[j];
            mediump[i++] = ((color >> 16)       ) / 255;
            mediump[i++] = (color  >>   8 & 0xFF) / 255;
            mediump[i++] = (color         & 0xFF) / 255;
            mediump[i++] = alphas[j];
        }

        // fragment: u_gradient_t
        for (let j = begin; j < end; j++) {
            mediump[i++] = ratios[j];
        }
    }
}