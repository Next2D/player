/**
 * @return {string}
 * @method
 * @static
 */
export const SOLID_COLOR = (): string =>
{
    return `#version 300 es
precision mediump float;

uniform vec4 u_mediump;
in vec4 v_color;
out vec4 o_color;

void main() {
    o_color = vec4(v_color.rgb * v_color.a, v_color.a);
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const BITMAP_CLIPPED = (): string =>
{
    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

in vec2 v_uv;
out vec4 o_color;

void main() {
    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;

    vec4 src = texture(u_texture, uv);
    o_color = src;
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const BITMAP_PATTERN = (): string =>
{
    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

in vec2 v_uv;
out vec4 o_color;

void main() {
    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);
    
    vec4 src = texture(u_texture, uv);
    o_color = src;
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const MASK = (): string =>
{
    return `#version 300 es
precision mediump float;

in vec2 v_bezier;
out vec4 o_color;

void main() {
    vec2 px = dFdx(v_bezier);
    vec2 py = dFdy(v_bezier);

    vec2 f = (2.0 * v_bezier.x) * vec2(px.x, py.x) - vec2(px.y, py.y);
    float alpha = 0.5 - (v_bezier.x * v_bezier.x - v_bezier.y) / length(f);

    if (alpha > 0.0) {
        o_color = vec4(min(alpha, 1.0));
    } else {
        discard;
    }    
}`;
};