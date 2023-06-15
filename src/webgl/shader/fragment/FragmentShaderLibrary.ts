/**
 * @class
 */
export class FragmentShaderLibrary
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_IS_INSIDE (): string
    {
        return `

float isInside(in vec2 uv) {
    return step(4.0, dot(step(vec4(0.0, uv.x, 0.0, uv.y), vec4(uv.x, 1.0, uv.y, 1.0)), vec4(1.0)));
}

`;
    }

    /**
     * @param  {number} mediump_index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_COLOR_TRANSFORM_ON (mediump_index: number): string
    {
        return `
    vec4 mul = u_mediump[${mediump_index}];
    vec4 add = u_mediump[${mediump_index + 1}];

    src.rgb /= max(0.0001, src.a);
    src = clamp(src * mul + add, 0.0, 1.0);
    src.rgb *= src.a;
`;
    }
}
