/**
 * @description ステンシル書き込み用フラグメントシェーダー（ベジェ曲線アンチエイリアス）
 *              Stencil write fragment shader with bezier curve anti-aliasing
 *
 * @type {string}
 * @constant
 */
export const StencilWriteFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    let f_val = input.bezier.x * input.bezier.x - input.bezier.y;
    let dx = dpdx(f_val);
    let dy = dpdy(f_val);
    let dist = f_val * inverseSqrt(dx * dx + dy * dy);
    let alpha = smoothstep(0.5, -0.5, dist);

    if (alpha <= 0.001) {
        discard;
    }

    return vec4<f32>(0.0, 0.0, 0.0, min(alpha, 1.0));
}
`;

/**
 * @description ステンシル塗り用フラグメントシェーダー（プリマルチプライドアルファ出力）
 *              Stencil fill fragment shader with premultiplied alpha output
 *
 * @type {string}
 * @constant
 */
export const StencilFillFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    let a = input.color.a;
    return vec4<f32>(input.color.r * a, input.color.g * a, input.color.b * a, a);
}
`;
