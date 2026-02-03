export const FillFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    // Loop-Blinn法によるアンチエイリアス（WebGL版MASKシェーダーと同じ）
    let f_val = input.bezier.x * input.bezier.x - input.bezier.y;

    // dFdx/dFdy相当の偏微分を計算
    let dx = dpdx(f_val);
    let dy = dpdy(f_val);

    // 距離フィールドからアルファ値を計算
    let dist = f_val / length(vec2<f32>(dx, dy));
    let coverage = smoothstep(0.5, -0.5, dist);

    if (coverage <= 0.001) {
        discard;
    }

    // カバレッジを色のアルファに適用（プリマルチプライドアルファ）
    let finalAlpha = input.color.a * min(coverage, 1.0);
    return vec4<f32>(input.color.rgb * finalAlpha, finalAlpha);
}
`;
