export const StencilWriteFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    // Loop-Blinn法によるアンチエイリアス（WebGL版と同じ）
    let f_val = input.bezier.x * input.bezier.x - input.bezier.y;

    // dFdx/dFdy相当の偏微分を計算
    let dx = dpdx(f_val);
    let dy = dpdy(f_val);

    // 距離フィールドからアルファ値を計算
    let dist = f_val / length(vec2<f32>(dx, dy));
    let alpha = smoothstep(0.5, -0.5, dist);

    if (alpha <= 0.001) {
        discard;
    }

    // alphaToCoverageでアンチエイリアスを実現するためアルファ値を出力
    return vec4<f32>(0.0, 0.0, 0.0, min(alpha, 1.0));
}
`;

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
