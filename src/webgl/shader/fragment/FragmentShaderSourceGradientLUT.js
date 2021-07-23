/**
 * @class
 */
class FragmentShaderSourceGradientLUT
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  mediumpLength
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, mediumpLength, stopsLength, isLinearSpace)
    {
        let loopStatement = "";
        for (let i = 1; i < stopsLength; i++) {
            const i0 = i - 1;
            const i1 = i;
            const t0 = `u_mediump[${stopsLength + Util.$floor(i0 / 4)}][${i0 % 4}]`;
            const t1 = `u_mediump[${stopsLength + Util.$floor(i1 / 4)}][${i1 % 4}]`;
            const c0 = `u_mediump[${i0}]`;
            const c1 = `u_mediump[${i1}]`;
            loopStatement += `
    if (t <= ${t1}) {
        return mix(${c0}, ${c1}, (t - ${t0}) / (${t1} - ${t0}));
    }
`;
        }

        const colorSpaceStatement = (isLinearSpace)
            ? "color = pow(color, vec4(0.45454545));"
            : "";

        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump[${mediumpLength}];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

vec4 getGradientColor(in float t) {
    if (t <= u_mediump[${stopsLength}][0]) {
        return u_mediump[0];
    }
    ${loopStatement}
    return u_mediump[${stopsLength - 1}];
}

void main() {
    vec4 color = getGradientColor(v_coord.x);
    ${colorSpaceStatement}
    color.rgb *= color.a;

    ${k.fragColor()} = color;
}

`;
    }
}