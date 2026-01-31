export const FillVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
    @location(3) matrix0: vec3<f32>,
    @location(4) matrix1: vec3<f32>,
    @location(5) matrix2: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct Uniforms {
    viewportSize: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let matrix = mat3x3<f32>(input.matrix0, input.matrix1, input.matrix2);
    let transformed = matrix * vec3<f32>(input.position, 1.0);
    let ndc = transformed.xy * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);
    output.bezier = input.bezier;
    output.color = input.color;
    return output;
}
`;

export const FillMainVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
    @location(3) matrix0: vec3<f32>,
    @location(4) matrix1: vec3<f32>,
    @location(5) matrix2: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct Uniforms {
    viewportSize: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let matrix = mat3x3<f32>(input.matrix0, input.matrix1, input.matrix2);
    let transformed = matrix * vec3<f32>(input.position, 1.0);
    let ndc = transformed.xy * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);
    output.bezier = input.bezier;
    output.color = input.color;
    return output;
}
`;
