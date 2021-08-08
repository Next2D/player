/**
 * @class
 */
class GradientLUTGenerator
{
    /**
     * @param {WebGLRenderingContext} gl
     * @param {CanvasToWebGLContext}  context
     * @constructor
     * @public
     */
    constructor (context, gl)
    {
        this._$context    = context;
        this._$gl         = gl;
        this._$attachment = context.frameBuffer.createTextureAttachment(512, 1);
        this._$maxLength  = Util.$floor(this._$gl.getParameter(this._$gl.MAX_FRAGMENT_UNIFORM_VECTORS) * 0.75);

        this._$rgbToLinearTable = new Util.$Float32Array(256);
        this._$rgbIdentityTable = new Util.$Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const t = i / 255;
            this._$rgbToLinearTable[i] = Util.$pow(t, 2.23333333);
            this._$rgbIdentityTable[i] = t;
        }
    }

    /**
     * @param  {array}   stops
     * @param  {boolean} is_linear_space
     * @return {WebGLTexture}
     * @method
     * @public
     */
    generateForShape (stops, is_linear_space)
    {
        const currentAttachment = this._$context.frameBuffer.currentAttachment;

        this._$context._$bind(this._$attachment);

        const stopsLength = stops.length;
        const variants = this._$context._$shaderList.gradientLUTShaderVariants;
        const table = is_linear_space ? this._$rgbToLinearTable : this._$rgbIdentityTable;

        this._$context.blend.toOneZero();

        for (let begin = 0; begin < stopsLength; begin += this._$maxLength - 1) {
            const end = Util.$min(begin + this._$maxLength, stopsLength);

            const shader = variants.getGradientLUTShader(end - begin, is_linear_space);
            const uniform = shader.uniform;
            variants.setGradientLUTUniformForShape(uniform, stops, begin, end, table);

            shader._$drawGradient(
                begin === 0 ? 0 : stops[begin][0],
                end === stopsLength ? 1 : stops[end - 1][0]
            );
        }

        this._$context._$bind(currentAttachment);

        return this._$attachment.texture;
    }

    /**
     * @param  {array} ratios
     * @param  {array} colors
     * @param  {array} alphas
     * @return {WebGLTexture}
     * @method
     * @public
     */
    generateForFilter (ratios, colors, alphas)
    {
        const currentAttachment = this._$context.frameBuffer.currentAttachment;

        this._$context._$bind(this._$attachment);

        const stopsLength = ratios.length;
        const variants = this._$context._$shaderList.gradientLUTShaderVariants;

        this._$context.blend.toOneZero();

        for (let begin = 0; begin < stopsLength; begin += this._$maxLength - 1) {
            const end = Util.$min(begin + this._$maxLength, stopsLength);

            const shader = variants.getGradientLUTShader(end - begin, false);
            const uniform = shader.uniform;
            variants.setGradientLUTUniformForFilter(uniform, ratios, colors, alphas, begin, end);

            shader._$drawGradient(
                begin === 0 ? 0 : ratios[begin],
                end === stopsLength ? 1 : ratios[end - 1]
            );
        }

        this._$context._$bind(currentAttachment);

        return this._$attachment.texture;
    }
}