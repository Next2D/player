/**
 * @class
 */
class FragmentShaderSourceConvolutionFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  mediumpLength
     * @param  {number}  x
     * @param  {number}  y
     * @param  {boolean} preserveAlpha
     * @param  {boolean} clamp
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, mediumpLength, x, y, preserveAlpha, clamp)
    {
        const halfX = Util.$floor(x * 0.5);
        const halfY = Util.$floor(y * 0.5);
        const size = x * y;

        let matrixStatement = "";
        const matrixIndex = (clamp) ? 1 : 2;
        for (let i = 0; i < size; i++) {
            const index     = matrixIndex + Util.$floor(i / 4);
            const component = i % 4;
            matrixStatement += `
    result += getWeightedColor(${i}, u_mediump[${index}][${component}]);
`;
        }      

        const preserveAlphaStatement = (preserveAlpha)
            ? `result.a = ${k.texture2D()}(u_texture, v_coord).a;`
            : "";
        const clampStatement = (clamp)
            ? ""
            : `
    vec4 substitute_color = u_mediump[1];
    color = mix(substitute_color, color, isInside(uv));
`;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[${mediumpLength}];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}

vec4 getWeightedColor (in int i, in float weight) {
    vec2 rcp_size = u_mediump[0].xy;

    int i_div_x = i / ${x};
    int i_mod_x = i - ${x} * i_div_x;
    vec2 offset = vec2(i_mod_x - ${halfX}, ${halfY} - i_div_x);
    vec2 uv = v_coord + offset * rcp_size;

    vec4 color = ${k.texture2D()}(u_texture, uv);
    color.rgb /= max(0.0001, color.a);
    ${clampStatement}

    return color * weight;
}

void main() {
    float rcp_divisor = u_mediump[0].z;
    float bias        = u_mediump[0].w;

    vec4 result = vec4(0.0);
    ${matrixStatement}
    result = clamp(result * rcp_divisor + bias, 0.0, 1.0);
    ${preserveAlphaStatement}

    result.rgb *= result.a;
    ${k.fragColor()} = result;
}

`;
    }
}
