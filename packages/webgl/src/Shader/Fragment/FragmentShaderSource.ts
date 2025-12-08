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
 * @description マスク専用のシェーダ。Loop-Blinn法による高品質アンチエイリアシング。
 *              Shader dedicated to masks. High-quality anti-aliasing using Loop-Blinn method.
 *
 * @see GPU Gems 3, Chapter 25: Rendering Vector Art on the GPU
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
    // 2次ベジエ曲線の陰関数: f(u,v) = u² - v
    // Implicit function for quadratic Bezier: f(u,v) = u² - v
    float f_val = v_bezier.x * v_bezier.x - v_bezier.y;

    // スクリーン空間での勾配を計算（偏微分）
    // Calculate screen-space gradient (partial derivatives)
    float dx = dFdx(f_val);
    float dy = dFdy(f_val);

    // 勾配の大きさで正規化した符号付き距離
    // Signed distance normalized by gradient magnitude
    float dist = f_val / length(vec2(dx, dy));

    // smoothstepによる安定したアンチエイリアシング（約1ピクセル幅の遷移）
    // Stable anti-aliasing with smoothstep (approximately 1 pixel wide transition)
    float alpha = smoothstep(0.5, -0.5, dist);

    if (alpha > 0.001) {
        o_color = vec4(alpha);
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