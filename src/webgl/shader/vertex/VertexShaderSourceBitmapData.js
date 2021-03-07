/**
 * @class
 */
class VertexShaderSourceBitmapData
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static POSITION_ONLY (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[3];

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SRC_AND_DST_TEX_COORD (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[5];

${k.varyingOut()} vec2 v_src_tex_coord;
${k.varyingOut()} vec2 v_dst_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w)
    );

    v_src_tex_coord = (src_tex_matrix * vec3(a_vertex, 1.0)).xy;
    v_dst_tex_coord = vec2(a_vertex.x, 1.0 - a_vertex.y);

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SRC_TEX_COORD (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[5];

${k.varyingOut()} vec2 v_src_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w)
    );

    v_src_tex_coord = (src_tex_matrix * vec3(a_vertex, 1.0)).xy;

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SRC_AND_ALPHA_TEX_COORD (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform vec4 u_highp[7];

${k.varyingOut()} vec2 v_src_tex_coord;
${k.varyingOut()} vec2 v_alpha_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(u_highp[3].xyz, u_highp[4].xyz, u_highp[5].xyz);
    mat3 alpha_tex_matrix = mat3(
        u_highp[6].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w),
        vec3(u_highp[3].w, u_highp[4].w, u_highp[5].w)
    );

    v_src_tex_coord = (src_tex_matrix * vec3(a_vertex, 1.0)).xy;
    v_alpha_tex_coord = (alpha_tex_matrix * vec3(a_vertex, 1.0)).xy;

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PIXEL_DISSOLVE_COLOR (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform mat3 u_highp[3];

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);

    gl_PointSize = 1.0;
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PIXEL_DISSOLVE_TEXTURE (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;

uniform mat3 u_highp[5];

${k.varyingOut()} vec2 v_src_tex_coord;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);
    mat3 src_tex_matrix = mat3(
        u_highp[3].xyz,
        u_highp[4].xyz,
        vec3(u_highp[0].w, u_highp[1].w, u_highp[2].w)
    );

    v_src_tex_coord = (u_src_tex_matrix * vec3(a_vertex, 1.0)).xy;

    vec2 position = (u_matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);

    gl_PointSize = 1.0;
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SET_PIXEL_QUEUE (k)
    {
        return `${k.version()}

${k.attribute(0)} vec2 a_vertex;
${k.attribute(1)} vec4 a_color;

uniform mat3 u_highp[3];

${k.varyingOut()} vec2 v_dst_tex_coord;
${k.varyingOut()} vec4 v_color;

void main() {
    mat3 matrix = mat3(u_highp[0].xyz, u_highp[1].xyz, u_highp[2].xyz);

    v_dst_tex_coord = vec2(a_vertex.x, 1.0 - a_vertex.y);
    v_color = a_color;

    vec2 position = (matrix * vec3(a_vertex, 1.0)).xy * 2.0 - 1.0;
    gl_Position = vec4(position, 0.0, 1.0);
}

`;
    }
}
