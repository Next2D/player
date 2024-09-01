/**
 * @description グリッドがオフの場合の頂点シェーダー
 *              Vertex shader when grid is off
 *
 * @return {string}
 * @method
 * @static
 */
export const FUNCTION_GRID_OFF = (): string =>
{
    return `
vec2 applyMatrix(in vec2 vertex) {
    mat3 matrix = mat3(
        u_highp[0].xyz,
        u_highp[1].xyz,
        u_highp[2].xyz
    );

    vec2 position = (matrix * vec3(vertex, 1.0)).xy;

    return position;
}`;
};

/**
 * @description グリッドがオンの場合の頂点シェーダー
 *              Vertex shader when grid is on
 *
 * @param  {number} index
 * @return {string}
 * @method
 * @static
 */
export const FUNCTION_GRID_ON = (index: number): string =>
{
    return `
vec2 applyMatrix(in vec2 vertex) {
    mat3 parent_matrix = mat3(
        u_highp[${index    }].xyz,
        u_highp[${index + 1}].xyz,
        u_highp[${index + 2}].xyz
    );
    mat3 ancestor_matrix = mat3(
        u_highp[${index + 3}].xyz,
        u_highp[${index + 4}].xyz,
        u_highp[${index + 5}].xyz
    );
    vec2 parent_offset = vec2(u_highp[${index + 2}].w, u_highp[${index + 3}].w);
    vec2 parent_size   = vec2(u_highp[${index + 4}].w, u_highp[${index + 5}].w);
    vec4 grid_min = u_highp[${index + 6}];
    vec4 grid_max = u_highp[${index + 7}];
    
    vec2 position = (parent_matrix * vec3(vertex, 1.0)).xy;
    position = (position - parent_offset) / parent_size;

    vec4 ga = grid_min;
    vec4 gb = grid_max  - grid_min;
    vec4 gc = vec4(1.0) - grid_max;

    vec2 pa = position;
    vec2 pb = position - grid_min.st;
    vec2 pc = position - grid_max.st;

    position = (ga.pq / ga.st) * min(pa, ga.st)
                + (gb.pq / gb.st) * clamp(pb, vec2(0.0), gb.st)
                + (gc.pq / gc.st) * max(vec2(0.0), pc);

    position = position * parent_size + parent_offset;
    position = (ancestor_matrix * vec3(position, 1.0)).xy;

    return position;
}`;
};