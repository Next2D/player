export const StencilWriteFragment = /* wgsl */`
struct FragmentInput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    let f = input.bezier.x * input.bezier.x - input.bezier.y;
    if (f >= 0.0) {
        discard;
    }
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
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
