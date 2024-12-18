import {
    FUNCTION_GRID_OFF,
    FUNCTION_GRID_ON
} from "./VertexShaderLibrary";

/**
 * @return {string}
 * @method
 * @static
 */
export const ATTRIBUTE_BEZIER_ON = (): string =>
{
    return "layout (location = 1) in vec2 a_bezier;";
};

/**
 * @returns {string}
 * @method
 * @static
 */
export const ATTRIBUTE_MATRIX_ON = (): string =>
{
    return `layout (location = 3) in vec3 a_matrix0;
layout (location = 4) in vec3 a_matrix1;
layout (location = 5) in vec3 a_matrix2;`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const VARYING_UV_ON = (): string =>
{
    return "out vec2 v_uv;";
};

/**
 * @return {string}
 * @method
 * @static
 */
export const VARYING_BEZIER_ON = (): string =>
{
    return "out vec2 v_bezier;";
};

/**
 * @return {string}
 * @method
 * @static
 */
export const STATEMENT_UV_ON = (): string =>
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
    v_uv = (inverse_matrix * uv_matrix * vec3(a_vertex, 1.0)).xy;`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const STATEMENT_BEZIER_ON = (): string =>
{
    return "v_bezier = a_bezier;";
};

/**
 * @return {string}
 * @method
 * @static
 */
export const ATTRIBUTE_COLOR_ON = (): string =>
{
    return "layout (location = 2) in vec4 a_color;";
};

/**
 * @return {string}
 * @method
 * @static
 */
export const VARYING_COLOR_ON = (): string =>
{
    return "out vec4 v_color;";
};

/**
 * @return {string}
 * @method
 * @static
 */
export const STATEMENT_COLOR_ON = (): string =>
{
    return "v_color = a_color;";
};

/**
 * @description 各種、塗りのシェーダのテンプレートを返却
 *              Returns a template for various fill shaders
 *
 * @param  {number}  highp_length
 * @param  {boolean} with_uv
 * @param  {boolean} for_mask
 * @param  {boolean} is_grid_enabled
 * @return {string}
 * @method
 * @static
 */
export const FILL_TEMPLATE = (
    highp_length: number,
    with_uv: boolean,
    for_mask: boolean,
    is_grid_enabled: boolean
): string => {

    const bezierAttribute = for_mask
        ? ATTRIBUTE_BEZIER_ON()
        : "";

    const uvVarying = for_mask
        ? VARYING_BEZIER_ON()
        : with_uv
            ? VARYING_UV_ON()
            : "";

    const uvStatement = for_mask
        ? STATEMENT_BEZIER_ON()
        : with_uv
            ? STATEMENT_UV_ON()
            : "";

    const gridFunction = is_grid_enabled
        ? FUNCTION_GRID_ON(with_uv ? 5 : 0)
        : FUNCTION_GRID_OFF();

    const colorAttribute = for_mask
        ? ""
        : ATTRIBUTE_COLOR_ON();

    const colorVarying = for_mask
        ? ""
        : VARYING_COLOR_ON();

    const colorStatement = for_mask
        ? ""
        : STATEMENT_COLOR_ON();

    const matrixAttribute = is_grid_enabled
        ? ""
        : ATTRIBUTE_MATRIX_ON();

    const uniform = highp_length > 1
        ? `uniform vec4 u_highp[${highp_length}];`
        : "";

    return `#version 300 es

layout (location = 0) in vec2 a_vertex;
${bezierAttribute}
${colorAttribute}
${matrixAttribute}

${uniform}
${uvVarying}
${colorVarying}
${gridFunction}

void main() {
    ${colorStatement}
    ${uvStatement}
    vec2 pos = applyMatrix(a_vertex);
    pos = pos * 2.0 - 1.0;
    gl_Position = vec4(pos.x, -pos.y, 0.0, 1.0);
}`;
};

/**
 * @description 矩形の塗りのシェーダのテンプレートを返却
 *              Returns a template for filling rectangles
 *
 * @return {string}
 * @method
 * @static
 */
export const FILL_RECT_TEMPLATE = (): string =>
{
    return `#version 300 es
layout (location = 0) in vec2 a_vertex;
void main() {
    gl_Position = vec4(a_vertex, 0.0, 1.0);
}`;
};