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
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, highpLength, fragmentIndex, isRadial, hasFocalPoint, spreadMethod)
    {
        const gradientTypeStatement = (isRadial)
            ? this.STATEMENT_GRADIENT_TYPE_RADIAL(fragmentIndex, hasFocalPoint)
            : this.STATEMENT_GRADIENT_TYPE_LINEAR(fragmentIndex);

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

        return `${k.version()}
precision highp float;

uniform sampler2D u_texture;
uniform vec4 u_highp[${highpLength}];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

void main() {
    vec2 p = v_uv;
    ${gradientTypeStatement}
    t = ${spreadMethodExpression};
    ${k.fragColor()} = ${k.texture2D()}(u_texture, vec2(t, 0.5));
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
     * @param  {number}  index
     * @param  {boolean} hasFocalPoint
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GRADIENT_TYPE_RADIAL (index, hasFocalPoint)
    {
        const focalPointStatement = (hasFocalPoint)
            ? this.STATEMENT_FOCAL_POINT_ON(index)
            : this.STATEMENT_FOCAL_POINT_OFF();
        return `
    float radius = u_highp[${index}][0];

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
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_FOCAL_POINT_ON (index)
    {
        return `
    vec2 focal = vec2(u_highp[${index}][1], 0.0);

    vec2 dir = normalize(coord - focal);

    float a = dot(dir, dir);
    float b = 2.0 * dot(dir, focal);
    float c = dot(focal, focal) - 1.0;
    float x = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);

    float t = distance(focal, coord) / distance(focal, focal + dir * x);
`;
    }
}
