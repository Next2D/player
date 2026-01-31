export const GradientFillVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
    @location(3) matrixRow0: vec3<f32>,
    @location(4) matrixRow1: vec3<f32>,
    @location(5) matrixRow2: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}

struct GradientUniforms {
    inverseMatrix: mat3x3<f32>,
    gradientType: f32,
    focal: f32,
    spread: f32,
    radius: f32,
    linearPoints: vec4<f32>,
}

@group(0) @binding(0) var<uniform> gradient: GradientUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let contextMatrix = mat3x3<f32>(input.matrixRow0, input.matrixRow1, input.matrixRow2);
    let pos = contextMatrix * vec3<f32>(input.position, 1.0);
    let ndc = vec2<f32>(pos.x * 2.0 - 1.0, pos.y * 2.0 - 1.0);
    output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);
    let uvPos = gradient.inverseMatrix * vec3<f32>(input.position, 1.0);
    output.v_uv = uvPos.xy;
    output.bezier = input.bezier;
    output.color = input.color;
    return output;
}
`;

export const GradientFillMainVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
    @location(3) matrixRow0: vec3<f32>,
    @location(4) matrixRow1: vec3<f32>,
    @location(5) matrixRow2: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}

struct GradientUniforms {
    inverseMatrix: mat3x3<f32>,
    gradientType: f32,
    focal: f32,
    spread: f32,
    radius: f32,
    linearPoints: vec4<f32>,
}

@group(0) @binding(0) var<uniform> gradient: GradientUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let contextMatrix = mat3x3<f32>(input.matrixRow0, input.matrixRow1, input.matrixRow2);
    let pos = contextMatrix * vec3<f32>(input.position, 1.0);
    let ndc = vec2<f32>(pos.x * 2.0 - 1.0, pos.y * 2.0 - 1.0);
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);
    let uvPos = gradient.inverseMatrix * vec3<f32>(input.position, 1.0);
    output.v_uv = uvPos.xy;
    output.bezier = input.bezier;
    output.color = input.color;
    return output;
}
`;
