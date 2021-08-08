/**
 * @class
 */
class FragmentShaderSourceColorMatrixFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[5];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

void main() {
    mat4 mul = mat4(u_mediump[0], u_mediump[1], u_mediump[2], u_mediump[3]);
    vec4 add = u_mediump[4];
    
    vec4 color = ${k.texture2D()}(u_texture, v_coord);

    color.rgb /= max(0.0001, color.a);
    color = clamp(color * mul + add, 0.0, 1.0);
    color.rgb *= color.a;

    ${k.fragColor()} = color;
}

`;
    }
}