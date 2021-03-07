/**
 * @class
 */
class FragmentShaderLibrary
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_IS_INSIDE ()
    {
        return `

float isInside(in vec2 uv) {
    return step(4.0, dot(step(vec4(0.0, uv.x, 0.0, uv.y), vec4(uv.x, 1.0, uv.y, 1.0)), vec4(1.0)));
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_COLOR_TRANSFORM_ON (mediumpIndex)
    {
        return `
    vec4 mul = u_mediump[${mediumpIndex}];
    vec4 add = u_mediump[${mediumpIndex + 1}];

    src.rgb /= max(0.0001, src.a);
    src = clamp(src * mul + add, 0.0, 1.0);
    src.rgb *= src.a;
`;
    }

    /**
     * @param  {number}  stopsLength
     * @param  {number}  uniformIndex
     * @param  {boolean} isHighPrecision
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_GRADIENT_COLOR (stopsLength, uniformIndex, isHighPrecision)
    {
        // c[i]: uniform[uniformIndex + i]
        // t[i]: uniform[uniformIndex + stopsLength + floor(i / 4)][i % 4]
        // if (t <= t[i]) return mix(c[i - 1], c[i], (t - t[i - 1]) / (t[i] - t[i - 1])))

        const uniformName = (isHighPrecision) ? "u_highp" : "u_mediump";

        let loopStatement = "";
        for (let i = 1; i < stopsLength; i++) {
            const i0 = i - 1;
            const i1 = i;
            const t0 = `${uniformName}[${uniformIndex + stopsLength + Util.$floor(i0 / 4)}][${i0 % 4}]`;
            const t1 = `${uniformName}[${uniformIndex + stopsLength + Util.$floor(i1 / 4)}][${i1 % 4}]`;
            const c0 = `${uniformName}[${uniformIndex + i0}]`;
            const c1 = `${uniformName}[${uniformIndex + i1}]`;
            loopStatement += `
    if (t <= ${t1}) {
        return mix(${c0}, ${c1}, (t - ${t0}) / (${t1} - ${t0}));
    }
`;
        }

        return `

vec4 getGradientColor(in float t) {
    if (t <= ${uniformName}[${uniformIndex + stopsLength}][0]) {
        return ${uniformName}[${uniformIndex}];
    }
    ${loopStatement}
    return ${uniformName}[${uniformIndex + stopsLength - 1}];
}

`;
    }
}
