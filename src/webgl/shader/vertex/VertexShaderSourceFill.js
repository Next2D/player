/**
 * @class
 */
class VertexShaderSourceFill
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  highpLength
     * @param  {boolean} withUV
     * @param  {boolean} forMask
     * @param  {boolean} hasGrid
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, highpLength, withUV, forMask, hasGrid)
    {
        const bezierAttribute = (forMask)
            ? this.ATTRIBUTE_BEZIER_ON(k)
            : "";
        const uvVarying =
              (forMask) ? this.VARYING_BEZIER_ON(k)
            : (withUV)  ? this.VARYING_UV_ON(k)
            : "";
        const uvStatement = 
              (forMask) ? this.STATEMENT_BEZIER_ON()
            : (withUV)  ? this.STATEMENT_UV_ON()
            : "";
        const gridFunction = (hasGrid)
            ? VertexShaderLibrary.FUNCTION_GRID_ON((withUV) ? 5 : 0)
            : VertexShaderLibrary.FUNCTION_GRID_OFF();

        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;
${bezierAttribute}

uniform vec4 u_highp[${highpLength}];

${uvVarying}

${gridFunction}

void main() {
    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);

    ${uvStatement}

    vec2 pos = applyMatrix(a_vertex) / viewport;
    pos = pos * 2.0 - 1.0;
    gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     */
    static ATTRIBUTE_BEZIER_ON (k)
    {
        return `
${k.attribute(1)} vec2 a_bezier;
`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static VARYING_UV_ON (k)
    {
        return `
${k.varyingOut()} vec2 v_uv;
`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static VARYING_BEZIER_ON (k)
    {
        return `
${k.varyingOut()} vec2 v_bezier;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_UV_ON ()
    {
        return `
    mat3 uv_matrix = mat3(
        u_highp[0].xyz,
        u_highp[1].xyz,
        u_highp[2].xyz
    );
    mat3 inverse_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[2].w, u_highp[3].w, u_highp[4].w)
    );

    v_uv = (inverse_matrix * uv_matrix * vec3(a_vertex, 1.0)).xy;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEZIER_ON ()
    {
        return `
    v_bezier = a_bezier;
`;
    }
}
