/**
 * @description 頂点シェーダから受け取ったカラー情報をそのまま出力。
 *              Outputs the color information received from the vertex shader as it is.
 *
 * @return {string}
 * @method
 * @static
 */
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

/**
 * @description ビットマップの繰り返しではない場合の塗りつぶし。
 *              Filling when the bitmap is not repeated.
 *
 * @return {string}
 * @method
 * @static
 */
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

/**
 * @description ビットマップの繰り返しの場合の塗りつぶし。
 *              Filling in the case of repeating the bitmap.
 *
 * @return {string}
 * @method
 * @static
 */
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

/**
 * @description マスク専用のシェーダ。
 *              Shader dedicated to masks.
 *
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

/**
 * @description 矩形の塗りつぶし、カラーは固定。
 *              Fill the rectangle, the color is fixed.
 *
 * @return {string}
 * @method
 * @static
 */
export const FILL_RECT_COLOR = (): string =>
{
    return `#version 300 es
precision mediump float;
out vec4 o_color;
void main() {
    o_color = vec4(1.0);
}`;
};