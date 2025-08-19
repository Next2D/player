/**
 * @description WebGPU基本頂点シェーダー
 *              WebGPU basic vertex shader
 */
export const basicVertexShader = /* wgsl */ `
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) texCoord: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct Uniforms {
    mvpMatrix: mat4x4<f32>,
    color: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.clipPosition = uniforms.mvpMatrix * vec4<f32>(input.position, 0.0, 1.0);
    output.texCoord = input.texCoord;
    return output;
}
`;

/**
 * @description WebGPU基本フラグメントシェーダー
 *              WebGPU basic fragment shader
 */
export const basicFragmentShader = /* wgsl */ `
struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct Uniforms {
    mvpMatrix: mat4x4<f32>,
    color: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return uniforms.color;
}
`;

/**
 * @description WebGPUテクスチャフラグメントシェーダー
 *              WebGPU texture fragment shader
 */
export const textureFragmentShader = /* wgsl */ `
struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct Uniforms {
    mvpMatrix: mat4x4<f32>,
    color: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var textureData: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let sampledColor = textureSample(textureData, textureSampler, input.texCoord);
    return sampledColor * uniforms.color;
}
`;

/**
 * @description WebGPUグラデーションフラグメントシェーダー
 *              WebGPU gradient fragment shader
 */
export const gradientFragmentShader = /* wgsl */ `
struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct Uniforms {
    mvpMatrix: mat4x4<f32>,
    color: vec4<f32>,
    gradientStart: vec2<f32>,
    gradientEnd: vec2<f32>,
    gradientColors: array<vec4<f32>, 8>,
    gradientStops: array<f32, 8>,
    numStops: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let gradientVector = uniforms.gradientEnd - uniforms.gradientStart;
    let position = input.clipPosition.xy;
    let gradientPosition = dot(position - uniforms.gradientStart, gradientVector) / dot(gradientVector, gradientVector);
    let t = clamp(gradientPosition, 0.0, 1.0);
    
    // Simple linear interpolation between first and last colors for now
    let color1 = uniforms.gradientColors[0];
    let color2 = uniforms.gradientColors[1];
    
    return mix(color1, color2, t);
}
`;