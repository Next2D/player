/**
 * @class
 */
export class VertexShaderSource
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static TEXTURE (): string
    {
        return `#version 300 es

layout (location = 0) in vec2 a_vertex;

out vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 position = a_vertex * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static BLEND (): string
    {
        return `#version 300 es

layout (location = 0) in vec2 a_vertex;

uniform vec4 u_highp[4];

out vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 offset   = u_highp[0].xy;
    vec2 size     = u_highp[0].zw;
    mat3 matrix   = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);
    vec2 viewport = vec2(u_highp[1].w, u_highp[2].w);

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * size + offset;
    position = (matrix * vec3(position, 1.0)).xy;
    position /= viewport;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static INSTANCE_BLEND (): string
    {
        return `#version 300 es

layout (location = 0) in vec2 a_vertex;

uniform vec4 u_highp[5];

out vec2 v_src_coord;
out vec2 v_dst_coord;

void main() {
    vec4 rect     = vec4(u_highp[0].x, u_highp[0].y, u_highp[0].z, u_highp[0].w);
    vec2 size     = vec2(u_highp[4].x, u_highp[4].y);
    mat3 matrix   = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);
    vec2 viewport = vec2(u_highp[1].w, u_highp[2].w);

    v_src_coord = a_vertex * rect.zw + rect.xy;
    v_dst_coord = a_vertex;

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * size;
    position = (matrix * vec3(position, 1.0)).xy;
    position /= viewport;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static INSTANCE (): string
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
out vec4 mul;
out vec4 add;

void main() {
    v_coord = a_vertex * a_rect.zw + a_rect.xy;
    mul = a_mul;
    add = a_add;

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position = position * a_size.xy;
    mat3 matrix = mat3(a_matrix.x, a_matrix.y, 0.0, a_matrix.z, a_matrix.w, 0.0, a_offset.x, a_offset.y, 1.0);
    position = (matrix * vec3(position, 1.0)).xy;
    position /= a_size.zw;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static BLEND_CLIP (): string
    {
        return `#version 300 es

layout (location = 0) in vec2 a_vertex;

uniform vec4 u_highp[4];

out vec2 v_coord;

void main() {
    v_coord = a_vertex;

    vec2 offset     = u_highp[0].xy;
    vec2 size       = u_highp[0].zw;
    mat3 inv_matrix = mat3(u_highp[1].xyz, u_highp[2].xyz, u_highp[3].xyz);
    vec2 viewport   = vec2(u_highp[1].w, u_highp[2].w);

    vec2 position = vec2(a_vertex.x, 1.0 - a_vertex.y);
    position *= viewport;
    position = (inv_matrix * vec3(position, 1.0)).xy;
    position = (position - offset) / size;

    position = position * 2.0 - 1.0;
    gl_Position = vec4(position.x, -position.y, 0.0, 1.0);
}

`;
    }
}