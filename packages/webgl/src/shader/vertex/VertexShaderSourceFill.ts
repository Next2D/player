import { VertexShaderLibrary } from "./VertexShaderLibrary";

/**
 * @class
 */
export class VertexShaderSourceFill
{
    /**
     * @param  {number}  highp_length
     * @param  {boolean} with_uv
     * @param  {boolean} for_mask
     * @param  {boolean} has_grid
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (
        highp_length: number, with_uv: boolean,
        for_mask: boolean, has_grid: boolean
    ): string {

        const bezierAttribute: string = for_mask
            ? this.ATTRIBUTE_BEZIER_ON()
            : "";

        const uvVarying: string = for_mask
            ? this.VARYING_BEZIER_ON()
            : with_uv
                ? this.VARYING_UV_ON()
                : "";

        const uvStatement: string = for_mask
            ? this.STATEMENT_BEZIER_ON()
            : with_uv
                ? this.STATEMENT_UV_ON()
                : "";

        const gridFunction: string = has_grid
            ? VertexShaderLibrary.FUNCTION_GRID_ON(with_uv ? 5 : 0)
            : VertexShaderLibrary.FUNCTION_GRID_OFF();

        return `#version 300 es

layout (location = 0) in vec2 a_vertex;
${bezierAttribute}

uniform vec4 u_highp[${highp_length}];

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
     * @return {string}
     * @method
     * @static
     */
    static ATTRIBUTE_BEZIER_ON (): string
    {
        return `
layout (location = 1) in vec2 a_bezier;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static VARYING_UV_ON (): string
    {
        return `
out vec2 v_uv;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static VARYING_BEZIER_ON (): string
    {
        return `
out vec2 v_bezier;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_UV_ON (): string
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
    static STATEMENT_BEZIER_ON (): string
    {
        return `
    v_bezier = a_bezier;
`;
    }
}