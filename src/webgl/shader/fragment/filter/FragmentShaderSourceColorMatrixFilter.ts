/**
 * @class
 */
export class FragmentShaderSourceColorMatrixFilter
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (): string
    {
        return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[5];

in vec2 v_coord;
out vec4 o_color;

void main() {
    mat4 mul = mat4(u_mediump[0], u_mediump[1], u_mediump[2], u_mediump[3]);
    vec4 add = u_mediump[4];
    
    vec4 color = texture(u_texture, v_coord);

    color.rgb /= max(0.0001, color.a);
    color = clamp(color * mul + add, 0.0, 1.0);
    color.rgb *= color.a;

    o_color = color;
}

`;
    }
}