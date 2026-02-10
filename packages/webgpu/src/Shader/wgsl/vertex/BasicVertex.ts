export const BasicVertex = /* wgsl */`
override yFlipSign: f32 = 1.0;

struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) texCoord: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct Uniforms {
    matrix: mat3x3<f32>,
    color: vec4<f32>,
    alpha: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let pos = uniforms.matrix * vec3<f32>(input.position, 1.0);
    let ndc = pos.xy * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, ndc.y * yFlipSign, 0.0, 1.0);
    output.texCoord = input.texCoord;
    let premultipliedColor = vec4<f32>(
        uniforms.color.rgb * uniforms.color.a * uniforms.alpha,
        uniforms.color.a * uniforms.alpha
    );
    output.color = premultipliedColor;
    return output;
}
`;
