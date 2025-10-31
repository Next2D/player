/**
 * @return {string}
 * @method
 * @static
 */
export const FUNCTION_IS_INSIDE = (): string =>
{
    return `
float isInside(in vec2 uv) {
    return step(4.0, dot(step(vec4(0.0, uv.x, 0.0, uv.y), vec4(uv.x, 1.0, uv.y, 1.0)), vec4(1.0)));
}`;
};

/**
 * @param  {number} mediump_index
 * @return {string}
 * @method
 * @static
 */
export const STATEMENT_COLOR_TRANSFORM_ON = (mediump_index: number): string =>
{
    return `
    vec4 mul = u_mediump[${mediump_index}];
    vec4 add = u_mediump[${mediump_index + 1}];

    if (mul.x != 1.0 || mul.y != 1.0 || mul.z != 1.0 || mul.w != 1.0
        || add.x != 0.0 || add.y != 0.0 || add.z != 0.0
    ) {
        src.rgb /= max(0.0001, src.a);
        src = clamp(src * mul + add, 0.0, 1.0);
        src.rgb *= src.a;
    }
`;
};