/**
 * @class
 */
class FragmentShaderSourceBlurFilter
{
    /**
     * @param  {number} half_blur
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (half_blur)
    {
        const halfBlurFixed = half_blur.toFixed(1);

        return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump;

in vec2 v_coord;
out vec4 o_color;

void main() {
    vec2  offset   = u_mediump.xy;
    float fraction = u_mediump.z;
    float samples  = u_mediump.w;
    
    vec4 color = texture(u_texture, v_coord);

    for (float i = 1.0; i < ${halfBlurFixed}; i += 1.0) {
        color += texture(u_texture, v_coord + offset * i);
        color += texture(u_texture, v_coord - offset * i);
    }
    color += texture(u_texture, v_coord + offset * ${halfBlurFixed}) * fraction;
    color += texture(u_texture, v_coord - offset * ${halfBlurFixed}) * fraction;
    color /= samples;

    o_color = color;
}

`;
    }
}