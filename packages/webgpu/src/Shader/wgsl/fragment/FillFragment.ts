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
    // 注意: dpdx/dpdyはuniform control flowから呼び出す必要があるため、
    // 条件分岐の前に実行する
    let dx = dpdx(f_val);
    let dy = dpdy(f_val);

    // ストローク塗りつぶし判定: bezier座標が(0.5, 0.5)の場合はLoop-Blinn法をスキップ
    // f_val = 0.5 * 0.5 - 0.5 = -0.25 < 0 なので曲線の内側だが、
    // smoothstepの計算で半透明になる可能性があるため、単純塗りつぶしを使用
    if (input.bezier.x == 0.5 && input.bezier.y == 0.5) {
        // 単純塗りつぶし（WebGL版のSOLID_FILL_COLORと同じ）
        return vec4<f32>(input.color.rgb * input.color.a, input.color.a);
    }

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
