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