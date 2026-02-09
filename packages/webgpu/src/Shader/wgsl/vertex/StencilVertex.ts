const createStencilWriteVertex = (yFlip: boolean): string => /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
}

struct FillUniforms {
    color: vec4<f32>,
    matrix0: vec4<f32>,
    matrix1: vec4<f32>,
    matrix2: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: FillUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let matrix = mat3x3<f32>(uniforms.matrix0.xyz, uniforms.matrix1.xyz, uniforms.matrix2.xyz);
    let transformed = matrix * vec3<f32>(input.position, 1.0);
    let ndc = transformed.xy * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, ${yFlip ? "-ndc.y" : "ndc.y"}, 0.0, 1.0);
    output.bezier = input.bezier;
    return output;
}
`;

export const StencilWriteVertex = createStencilWriteVertex(false);
export const StencilWriteMainVertex = createStencilWriteVertex(true);

const createStencilFillVertex = (yFlip: boolean): string => /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

struct FillUniforms {
    color: vec4<f32>,
    matrix0: vec4<f32>,
    matrix1: vec4<f32>,
    matrix2: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: FillUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let matrix = mat3x3<f32>(uniforms.matrix0.xyz, uniforms.matrix1.xyz, uniforms.matrix2.xyz);
    let transformed = matrix * vec3<f32>(input.position, 1.0);
    let ndc = transformed.xy * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, ${yFlip ? "-ndc.y" : "ndc.y"}, 0.0, 1.0);
    output.color = uniforms.color;
    return output;
}
`;

export const StencilFillVertex = createStencilFillVertex(false);
export const StencilFillMainVertex = createStencilFillVertex(true);
