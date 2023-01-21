/**
 * @class
 */
class FragmentShaderSourceTexture
{
    /**
     * @param  {boolean} with_color_transform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (with_color_transform)
    {
        const colorTransformUniform = with_color_transform
            ? "uniform vec4 u_mediump[2];"
            : "";
        const colorTransformStatement = with_color_transform
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
            : "";

        return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
${colorTransformUniform}

in vec2 v_coord;
out vec4 o_color;

void main() {
    vec4 src = texture(u_texture, v_coord);
    ${colorTransformStatement}
    o_color = src;
}

`;
    }
}