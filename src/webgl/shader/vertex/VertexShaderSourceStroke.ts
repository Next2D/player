import { VertexShaderLibrary } from "./VertexShaderLibrary";

/**
 * @class
 */
export class VertexShaderSourceStroke
{
    /**
     * @param  {number}  highp_length
     * @param  {number}  fragment_index
     * @param  {boolean} with_uv
     * @param  {boolean} has_grid
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (
        highp_length: number, fragment_index: number,
        with_uv: boolean, has_grid: boolean
    ): string {

        const strokeIndex: number = fragment_index - 1;

        const uvVarying: string = with_uv
            ? this.VARYING_UV_ON()
            : "";

        const uvStatement: string = with_uv
            ? this.STATEMENT_UV_ON()
            : "";

        const gridFunction: string = has_grid
            ? VertexShaderLibrary.FUNCTION_GRID_ON(with_uv ? 5 : 0)
            : VertexShaderLibrary.FUNCTION_GRID_OFF();

        return `#version 300 es

layout (location = 0) in vec2 a_vertex;
layout (location = 1) in vec2 a_option1;
layout (location = 2) in vec2 a_option2;
layout (location = 3) in float a_type;

uniform vec4 u_highp[${highp_length}];

${uvVarying}

${gridFunction}

float crossVec2(in vec2 v1, in vec2 v2) {
    return v1.x * v2.y - v2.x * v1.y;
}

vec2 perpendicularVec2(in vec2 v1) {
    float face = u_highp[${strokeIndex}][1];

    return face * vec2(v1.y, -v1.x);
}

vec2 calculateNormal(in vec2 direction) {
    vec2 normalized = normalize(direction);
    return perpendicularVec2(normalized);
}

vec2 calculateIntersection(in vec2 v1, in vec2 v2, in vec2 o1, in vec2 o2) {
    float t = crossVec2(o2 - o1, v2) / crossVec2(v1, v2);
    return (o1 + t * v1);
}

vec2 calculateAnchor(in vec2 position, in float convex, out vec2 v1, out vec2 v2, out vec2 o1, out vec2 o2) {
    float miter_limit = u_highp[${strokeIndex}][2];

    vec2 a = applyMatrix(a_option1);
    vec2 b = applyMatrix(a_option2);

    v1 = convex * (position - a);
    v2 = convex * (b - position);
    o1 = calculateNormal(v1) + a;
    o2 = calculateNormal(v2) + position;

    vec2 anchor = calculateIntersection(v1, v2, o1, o2) - position;
    return normalize(anchor) * min(length(anchor), miter_limit);
}

void main() {
    vec2 viewport = vec2(u_highp[0].w, u_highp[1].w);
    float half_width = u_highp[${strokeIndex}][0];

    vec2 position = applyMatrix(a_vertex);
    vec2 offset = vec2(0.0);
    vec2 v1, v2, o1, o2;

    if (a_type == 1.0 || a_type == 2.0) { // 線分
        offset = calculateNormal(a_option2 * (applyMatrix(a_option1) - position));
    } else if (a_type == 10.0) { // スクエア線端
        offset = normalize(position - applyMatrix(a_option1));
        offset += a_option2 * perpendicularVec2(offset);
    } else if (a_type == 21.0) { // マイター結合（線分Bの凸側）
        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;
    } else if (a_type == 22.0) { // マイター結合（線分Aの凸側）
        offset = calculateAnchor(position, 1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;
    } else if (a_type == 23.0) { // マイター結合（線分Aの凹側）
        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v1, perpendicularVec2(offset), o1, position + offset) - position;
    } else if (a_type == 24.0) { // マイター結合（線分Bの凹側）
        offset = calculateAnchor(position, -1.0, v1, v2, o1, o2);
        offset = calculateIntersection(v2, perpendicularVec2(offset), o2, position + offset) - position;
    } else if (a_type >= 30.0) { // ラウンド結合
        float face = u_highp[${strokeIndex}][1];
        float rad = face * (a_type - 30.0) * 0.3488888889; /* 0.3488888889 = PI / 9.0 */
        offset = mat2(cos(rad), sin(rad), -sin(rad), cos(rad)) * vec2(1.0, 0.0);
    }
    
    offset *= half_width;
    position += offset;
    ${uvStatement}

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

    v_uv = (uv_matrix * vec3(a_vertex, 1.0)).xy;
    v_uv += offset;
    v_uv = (inverse_matrix * vec3(v_uv, 1.0)).xy;
`;
    }
}