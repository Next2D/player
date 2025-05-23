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
 * @return {string}
 * @method
 * @static
 */
export const STATEMENT_INSTANCED_COLOR_TRANSFORM_ON = (): string =>
{
    return `
    src.rgb /= max(0.0001, src.a);
    src = clamp(src * mul + add, 0.0, 1.0);
    src.rgb *= src.a;`;
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
${STATEMENT_INSTANCED_COLOR_TRANSFORM_ON()}`;
};