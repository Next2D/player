import { FUNCTION_IS_INSIDE } from "../FragmentShaderLibrary";

/**
 * @param  {number}  mediump_length
 * @param  {number}  x
 * @param  {number}  y
 * @param  {boolean} preserve_alpha
 * @param  {boolean} clamp
 * @return {string}
 * @method
 * @static
 */
export const CONVOLUTION_FILTER_TEMPLATE = (
    mediump_length: number,
    x: number,
    y: number,
    preserve_alpha: boolean,
    clamp: boolean
): string => {

    const halfX = Math.floor(x * 0.5);
    const halfY = Math.floor(y * 0.5);
    const size  = x * y;

    let matrixStatement = "";
    const matrixIndex = clamp ? 1 : 2;
    for (let idx = 0; idx < size; ++idx) {

        const index = matrixIndex + Math.floor(idx / 4);

        const component = idx % 4;

        matrixStatement += `
    result += getWeightedColor(${idx}, u_mediump[${index}][${component}]);
`;
    }

    const preserve_alphaStatement = preserve_alpha
        ? "result.a = texture(u_texture, v_coord).a;"
        : "";
    const clampStatement = clamp
        ? ""
        : `
    vec4 substitute_color = u_mediump[1];
    color = mix(substitute_color, color, isInside(uv));
`;

    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[${mediump_length}];

in vec2 v_coord;
out vec4 o_color;

${FUNCTION_IS_INSIDE()}

vec4 getWeightedColor (in int i, in float weight) {
    vec2 rcp_size = u_mediump[0].xy;

    int i_div_x = i / ${x};
    int i_mod_x = i - ${x} * i_div_x;
    vec2 offset = vec2(i_mod_x - ${halfX}, ${halfY} - i_div_x);
    vec2 uv = v_coord + offset * rcp_size;

    vec4 color = texture(u_texture, uv);
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
    ${preserve_alphaStatement}

    result.rgb *= result.a;
    o_color = result;
}`;
};