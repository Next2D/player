/**
 * @return {string}
 * @method
 * @static
 */
export const TEXTURE_TEMPLATE = (): string =>
{
    return `#version 300 es

layout (location = 0) in vec2 a_vertex;

out vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 position = a_vertex * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const BLEND_MATRIX_TEMPLATE = (): string =>
{
    return `#version 300 es

layout (location = 0) in vec2 a_vertex;
uniform vec4 u_highp[3];

out vec2 v_coord;

void main() {
    v_coord = a_vertex;

    mat3 matrix = mat3(
        u_highp[0].x, u_highp[0].y, 0.0,
        u_highp[0].z, u_highp[0].w, 0.0,
        u_highp[1].x, u_highp[1].y, 1.0
    );

    vec2 size     = u_highp[1].zw;
    vec2 viewport = vec2(u_highp[2].x, u_highp[2].y);

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * size;
    position = (matrix * vec3(position, 1.0)).xy;
    position /= viewport;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const BLEND_TEMPLATE = (): string =>
{
    return `#version 300 es

layout (location = 0) in vec2 a_vertex;
uniform vec4 u_highp[2];

out vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 offset   = u_highp[0].xy;
    vec2 size     = u_highp[0].zw;
    vec2 viewport = vec2(u_highp[1].x, u_highp[1].y);

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * size + offset;
    position /= viewport;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const INSTANCE_TEMPLATE = (): string =>
{
    return `#version 300 es

layout (location = 0) in vec2 a_vertex;
layout (location = 1) in vec4 a_rect;
layout (location = 2) in vec4 a_size;
layout (location = 3) in vec2 a_offset;
layout (location = 4) in vec4 a_matrix;
layout (location = 5) in vec4 a_mul;
layout (location = 6) in vec4 a_add;

out vec2 v_coord;
out vec4 v_mul;
out vec4 v_add;

void main() {
    v_coord = a_vertex * a_rect.zw + a_rect.xy;
    v_mul = a_mul;
    v_add = a_add;

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * a_size.xy;

    mat3 matrix = mat3(
        a_matrix.x, a_matrix.y, 0.0,
        a_matrix.z, a_matrix.w, 0.0,
        a_offset.x, a_offset.y, 1.0
    );

    position = (matrix * vec3(position, 1.0)).xy;
    position /= a_size.zw;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}`;
};