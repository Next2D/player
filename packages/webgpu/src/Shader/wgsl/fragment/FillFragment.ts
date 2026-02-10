export const FillFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    let f_val = input.bezier.x * input.bezier.x - input.bezier.y;
    let dx = dpdx(f_val);
    let dy = dpdy(f_val);

    if (input.bezier.x == 0.5 && input.bezier.y == 0.5) {
        return vec4<f32>(input.color.rgb * input.color.a, input.color.a);
    }

    let dist = f_val * inverseSqrt(dx * dx + dy * dy);
    let coverage = smoothstep(0.5, -0.5, dist);

    if (coverage <= 0.001) {
        discard;
    }

    let finalAlpha = input.color.a * min(coverage, 1.0);
    return vec4<f32>(input.color.rgb * finalAlpha, finalAlpha);
}
`;
