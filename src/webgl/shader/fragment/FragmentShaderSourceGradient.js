/**
 * @class
 */
class FragmentShaderSourceGradient
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  highpLength
     * @param  {number}  fragmentIndex
     * @param  {boolean} isRadial
     * @param  {boolean} hasFocalPoint
     * @param  {string}  spreadMethod
     * @param  {number}  stopsLength
     * @param  {boolean} isLinearSpace
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, highpLength, fragmentIndex, isRadial, hasFocalPoint, spreadMethod, stopsLength, isLinearSpace)
    {
        const gradientTypeStatement = (isRadial)
            ? this.STATEMENT_GRADIENT_TYPE_RADIAL(fragmentIndex * 4 + stopsLength * 5, hasFocalPoint)
            : this.STATEMENT_GRADIENT_TYPE_LINEAR(fragmentIndex);
        const gradientColorIndex = fragmentIndex + ((isRadial) ? 0 : 1);
        
        let spreadMethodExpression;
        switch (spreadMethod) {
            case "reflect":
                spreadMethodExpression = "1.0 - abs(fract(t * 0.5) * 2.0 - 1.0)";
                break;
            case "repeat":
                spreadMethodExpression = "fract(t)";
                break;
            default:
                spreadMethodExpression = "clamp(t, 0.0, 1.0)";
                break;
        }

        const colorSpaceStatement = (isLinearSpace)
            ? "color = pow(color, vec4(0.45454545));"
            : "";

        return `${k.version()}
precision highp float;

uniform vec4 u_highp[${highpLength}];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_GRADIENT_COLOR(stopsLength, gradientColorIndex, true)}

void main() {
    vec2 p = v_uv;
    ${gradientTypeStatement}
    t = ${spreadMethodExpression};
    vec4 color = getGradientColor(t);
    ${colorSpaceStatement}
    color.rgb *= color.a;
    ${k.fragColor()} = color;
}

`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GRADIENT_TYPE_LINEAR (index)
    {
        return `
    vec2 a = u_highp[${index}].xy;
    vec2 b = u_highp[${index}].zw;

    vec2 ab = b - a;
    vec2 ap = p - a;

    float t = dot(ab, ap) / dot(ab, ab);
`;
    }

    /**
     * @param  {number} offset
     * @param  {boolean} hasFocalPoint
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GRADIENT_TYPE_RADIAL (offset, hasFocalPoint)
    {
        const index     = Util.$floor(offset / 4);
        const component = offset % 4;
        const focalPointStatement = (hasFocalPoint)
            ? this.STATEMENT_FOCAL_POINT_ON(offset + 1)
            : this.STATEMENT_FOCAL_POINT_OFF();
        return `
    float radius = u_highp[${index}][${component}];

    vec2 coord = p / radius;
    ${focalPointStatement}
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_FOCAL_POINT_OFF ()
    {
        return `
    float t = length(coord);
`;
    }

    /**
     * @param  {number} offset
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_FOCAL_POINT_ON (offset)
    {
        const index     = Util.$floor(offset / 4);
        const component = offset % 4;
        return `
    vec2 focal = vec2(u_highp[${index}][${component}], 0.0);

    vec2 dir = normalize(coord - focal);

    float a = dot(dir, dir);
    float b = 2.0 * dot(dir, focal);
    float c = dot(focal, focal) - 1.0;
    float x = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);

    float t = distance(focal, coord) / distance(focal, focal + dir * x);
`;
    }
}
