export const FillFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    let f = input.bezier.x * input.bezier.x - input.bezier.y;
    if (f >= 0.0) {
        discard;
    }
    return vec4<f32>(input.color.rgb * input.color.a, input.color.a);
}
`;
