/**
 * @param  {number} index
 * @return {string}
 * @method
 * @private
 */
const STATEMENT_FOCAL_POINT_ON = (index: number): string =>
{
    return `
    vec2 focal = vec2(u_highp[${index}][1], 0.0);

    vec2 dir = normalize(coord - focal);

    float a = dot(dir, dir);
    float b = 2.0 * dot(dir, focal);
    float c = dot(focal, focal) - 1.0;
    float x = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);

    float t = distance(focal, coord) / distance(focal, focal + dir * x);`;
};

/**
 * @return {string}
 * @method
 * @private
 */
const STATEMENT_FOCAL_POINT_OFF = (): string =>
{
    return "float t = length(coord);";
};

/**
 * @param  {number} index
 * @param  {boolean} has_focal_point
 * @return {string}
 * @method
 * @private
 */
const STATEMENT_GRADIENT_TYPE_RADIAL = (index: number, has_focal_point: boolean): string =>
{
    const focalPointStatement = has_focal_point
        ? STATEMENT_FOCAL_POINT_ON(index)
        : STATEMENT_FOCAL_POINT_OFF();

    return `
    float radius = u_highp[${index}][0];
    vec2 coord = p / radius;
    ${focalPointStatement}
`;
};

/**
 * @param {number} index
 * @return {string}
 * @method
 * @private
 */
const STATEMENT_GRADIENT_TYPE_LINEAR = (index: number): string =>
{
    return `
    vec2 a = u_highp[${index}].xy;
    vec2 b = u_highp[${index}].zw;

    vec2 ab = b - a;
    vec2 ap = p - a;

    float t = dot(ab, ap) / dot(ab, ab);`;
};

/**
 * @param  {number} highp_length
 * @param  {number} fragment_index
 * @param  {boolean} is_radial
 * @param  {boolean} has_focal_point
 * @param  {number} spread_method
 * @return {string}
 * @method
 * @private
 */
export const GRADIENT_TEMPLATE = (
    highp_length: number,
    fragment_index: number,
    is_radial: boolean,
    has_focal_point: boolean,
    spread_method: number
): string => {

    const gradientTypeStatement = is_radial
        ? STATEMENT_GRADIENT_TYPE_RADIAL(fragment_index, has_focal_point)
        : STATEMENT_GRADIENT_TYPE_LINEAR(fragment_index);

    let spread_methodExpression: string;
    switch (spread_method) {

        case 0:
            spread_methodExpression = "1.0 - abs(fract(t * 0.5) * 2.0 - 1.0)";
            break;

        case 1:
            spread_methodExpression = "fract(t)";
            break;

        default:
            spread_methodExpression = "clamp(t, 0.0, 1.0)";
            break;

    }

    return `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec4 u_highp[${highp_length}];
    
in vec2 v_uv;
out vec4 o_color;
    
void main() {
    vec2 p = v_uv;
    ${gradientTypeStatement}
    t = ${spread_methodExpression};
    o_color = texture(u_texture, vec2(t, 0.5));
}`;
};
