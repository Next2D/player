/**
 * @class
 */
class FragmentShaderSourceTexture
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {boolean} withColorTransform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, withColorTransform)
    {
        const colorTransformUniform = (withColorTransform)
            ? `uniform vec4 u_mediump[2];`
            : "";
        const colorTransformStatement = (withColorTransform)
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
