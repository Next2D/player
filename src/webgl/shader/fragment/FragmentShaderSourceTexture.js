/**
 * @class
 */
class FragmentShaderSourceTexture
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {boolean} with_color_transform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, with_color_transform)
    {
        const colorTransformUniform = with_color_transform
            ? "uniform vec4 u_mediump[2];"
            : "";
        const colorTransformStatement = with_color_transform
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
            : "";

        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
${colorTransformUniform}

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

void main() {
    vec4 src = ${k.texture2D()}(u_texture, v_coord);
    ${colorTransformStatement}
    ${k.fragColor()} = src;
}

`;
    }
}