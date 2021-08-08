/**
 * @class
 */
class FragmentShaderSourceBlurFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number} half_blur
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, half_blur)
    {
        const halfBlurFixed = half_blur.toFixed(1);

        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump;

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

void main() {
    vec2  offset   = u_mediump.xy;
    float fraction = u_mediump.z;
    float samples  = u_mediump.w;
    
    vec4 color = ${k.texture2D()}(u_texture, v_coord);

    for (float i = 1.0; i < ${halfBlurFixed}; i += 1.0) {
        color += ${k.texture2D()}(u_texture, v_coord + offset * i);
        color += ${k.texture2D()}(u_texture, v_coord - offset * i);
    }
    color += ${k.texture2D()}(u_texture, v_coord + offset * ${halfBlurFixed}) * fraction;
    color += ${k.texture2D()}(u_texture, v_coord - offset * ${halfBlurFixed}) * fraction;
    color /= samples;

    ${k.fragColor()} = color;
}

`;
    }
}