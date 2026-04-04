/**
 * @description ステンシル書き込み用頂点シェーダー（ベジェ曲線パラメータ付き）
 *              Stencil write vertex shader with bezier parameters
 *
 * @type {string}
 * @constant
 */
export const StencilWriteVertex = /* wgsl */`
override yFlipSign: f32 = 1.0;

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
    output.position = vec4<f32>(ndc.x, ndc.y * yFlipSign, 0.0, 1.0);
    output.bezier = input.bezier;
    return output;
}
`;

/**
 * @description ステンシル塗り用頂点シェーダー（カラー出力付き）
 *              Stencil fill vertex shader with color output
 *
 * @type {string}
 * @constant
 */
export const StencilFillVertex = /* wgsl */`
override yFlipSign: f32 = 1.0;

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
    output.position = vec4<f32>(ndc.x, ndc.y * yFlipSign, 0.0, 1.0);
    output.color = uniforms.color;
    return output;
}
`;
