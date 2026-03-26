/**
 * @description マスク用頂点シェーダー（ベジェ曲線パラメータ付き行列変換）
 *              Mask vertex shader with matrix transform and bezier parameters
 *
 * @type {string}
 * @constant
 */
export const MaskVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
}

struct Uniforms {
    viewportSize: vec2<f32>,
    _padding0: vec2<f32>,
    matrixCol0: vec3<f32>,
    _padding1: f32,
    matrixCol1: vec3<f32>,
    _padding2: f32,
    matrixCol2: vec3<f32>,
    _padding3: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let matrix = mat3x3<f32>(uniforms.matrixCol0, uniforms.matrixCol1, uniforms.matrixCol2);
    let transformed = matrix * vec3<f32>(input.position, 1.0);
    let pos = transformed.xy;
    let ndc = pos * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);
    output.bezier = input.bezier;
    return output;
}
`;
