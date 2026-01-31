export const MaskFragment = /* wgsl */`
struct FragmentInput {
    @location(0) bezier: vec2<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    let px = dpdx(input.bezier);
    let py = dpdy(input.bezier);
    let f = (2.0 * input.bezier.x) * vec2<f32>(px.x, py.x) - vec2<f32>(px.y, py.y);
    let alpha = 0.5 - (input.bezier.x * input.bezier.x - input.bezier.y) / length(f);
    if (alpha <= 0.0) {
        discard;
    }
    return vec4<f32>(min(alpha, 1.0));
}
`;
