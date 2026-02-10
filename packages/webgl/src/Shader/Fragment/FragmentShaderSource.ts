export const SOLID_FILL_COLOR = (): string =>
{
    return `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 o_color;

void main() {
    o_color = vec4(v_color.rgb * v_color.a, v_color.a);
}`;
};

export const BITMAP_CLIPPED = (): string =>
{
    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[1];

in vec2 v_uv;
out vec4 o_color;

void main() {
    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;

    vec4 src = texture(u_texture, uv);
    o_color = src;
}`;
};

export const BITMAP_PATTERN = (): string =>
{
    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[1];

in vec2 v_uv;
out vec4 o_color;

void main() {
    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);

    vec4 src = texture(u_texture, uv);
    o_color = src;
}`;
};

export const MASK = (): string =>
{
    return `#version 300 es
precision mediump float;

in vec2 v_bezier;
out vec4 o_color;

void main() {
    float f_val = v_bezier.x * v_bezier.x - v_bezier.y;

    float dx = dFdx(f_val);
    float dy = dFdy(f_val);

    float dist = f_val / length(vec2(dx, dy));
    float alpha = smoothstep(0.5, -0.5, dist);

    if (alpha > 0.001) {
        o_color = vec4(min(alpha, 1.0));
    } else {
        discard;
    }
}`;
};

export const FILL_RECT_COLOR = (): string =>
{
    return `#version 300 es
precision mediump float;
out vec4 o_color;
void main() {
    o_color = vec4(1.0);
}`;
};
