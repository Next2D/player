/**
 * @description 頂点カラーをそのまま出力する基本フラグメントシェーダー
 *              Basic fragment shader that outputs vertex color directly
 *
 * @type {string}
 * @constant
 */
export const BasicFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return input.color;
}
`;

/**
 * @description テクスチャサンプリングと頂点カラーを乗算するフラグメントシェーダー
 *              Fragment shader that multiplies texture sampling with vertex color
 *
 * @type {string}
 * @constant
 */
export const TextureFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}

@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var textureData: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let textureColor = textureSampleLevel(textureData, textureSampler, input.texCoord, 0);
    return textureColor * input.color;
}
`;
