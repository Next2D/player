import { WgslVertexOutput } from "../common/SharedWgsl";

/**
 * @description テクスチャコピー用フラグメントシェーダー（スケール・オフセット付き）
 *              Texture copy fragment shader with scale and offset
 *
 * @type {string}
 * @constant
 */
export const TextureCopyFragment = /* wgsl */`
${WgslVertexOutput}

struct CopyUniforms {
    scale: vec2<f32>,
    offset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: CopyUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.texCoord * uniforms.scale + uniforms.offset;
    return textureSampleLevel(inputTexture, textureSampler, uv, 0);
}
`;

/**
 * @description ブラー用テクスチャコピーフラグメントシェーダー（境界クランプ付き）
 *              Blur texture copy fragment shader with boundary clamping
 *
 * @type {string}
 * @constant
 */
export const BlurTextureCopyFragment = /* wgsl */`
${WgslVertexOutput}

struct CopyUniforms {
    scale: vec2<f32>,
    offset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: CopyUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = (input.texCoord - uniforms.offset) * uniforms.scale;
    let clampedUv = clamp(uv, vec2<f32>(0.0), vec2<f32>(1.0));
    let color = textureSampleLevel(inputTexture, textureSampler, clampedUv, 0);
    let inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    return select(vec4<f32>(0.0, 0.0, 0.0, 0.0), color, inBounds);
}
`;

/**
 * @description フィルター出力用フラグメントシェーダー（境界チェック付きコピー）
 *              Filter output fragment shader with boundary-checked copy
 *
 * @type {string}
 * @constant
 */
export const FilterOutputFragment = /* wgsl */`
${WgslVertexOutput}

struct CopyUniforms {
    scale: vec2<f32>,
    offset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: CopyUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.texCoord * uniforms.scale + uniforms.offset;
    let clampedUv = clamp(uv, vec2<f32>(0.0), vec2<f32>(1.0));
    let color = textureSampleLevel(inputTexture, textureSampler, clampedUv, 0);
    let inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    return select(vec4<f32>(0.0, 0.0, 0.0, 0.0), color, inBounds);
}
`;

/**
 * @description カラー変換フラグメントシェーダー（乗算・加算カラー適用）
 *              Color transform fragment shader with multiply and add color application
 *
 * @type {string}
 * @constant
 */
export const ColorTransformFragment = /* wgsl */`
${WgslVertexOutput}

struct ColorTransformUniforms {
    mul: vec4<f32>,
    add: vec4<f32>,
}

@group(0) @binding(0) var<uniform> ct: ColorTransformUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var color = textureSampleLevel(inputTexture, textureSampler, input.texCoord, 0);

    color = vec4<f32>(color.rgb / max(vec3<f32>(0.0001), vec3<f32>(color.a)), color.a);
    color = clamp(color * ct.mul + ct.add, vec4<f32>(0.0), vec4<f32>(1.0));
    color = vec4<f32>(color.rgb * color.a, color.a);

    return color;
}
`;

/**
 * @description Y軸反転付きカラー変換フラグメントシェーダー
 *              Y-flip color transform fragment shader
 *
 * @type {string}
 * @constant
 */
export const YFlipColorTransformFragment = /* wgsl */`
${WgslVertexOutput}

struct YFlipCTUniforms {
    scale: vec2<f32>,
    offset: vec2<f32>,
    mul: vec4<f32>,
    add: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: YFlipCTUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let uv = input.texCoord * uniforms.scale + uniforms.offset;
    var color = textureSampleLevel(inputTexture, textureSampler, uv, 0);

    color = vec4<f32>(color.rgb / max(vec3<f32>(0.0001), vec3<f32>(color.a)), color.a);
    color = clamp(color * uniforms.mul + uniforms.add, vec4<f32>(0.0), vec4<f32>(1.0));
    color = vec4<f32>(color.rgb * color.a, color.a);

    return color;
}
`;

/**
 * @description カラーマトリクスフィルター用フラグメントシェーダー
 *              Color matrix filter fragment shader
 *
 * @type {string}
 * @constant
 */
export const ColorMatrixFilterFragment = /* wgsl */`
${WgslVertexOutput}

struct ColorMatrixUniforms {
    matrix: mat4x4<f32>,
    offset: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ColorMatrixUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var color = textureSampleLevel(inputTexture, textureSampler, input.texCoord, 0);

    color = vec4<f32>(color.rgb / max(vec3<f32>(0.0001), vec3<f32>(color.a)), color.a);
    var result = uniforms.matrix * color + uniforms.offset;
    result = clamp(result, vec4<f32>(0.0), vec4<f32>(1.0));
    result = vec4<f32>(result.rgb * result.a, result.a);

    return result;
}
`;

/**
 * @description ノードクリア用フラグメントシェーダー（透明色出力）
 *              Node clear fragment shader that outputs transparent color
 *
 * @type {string}
 * @constant
 */
export const NodeClearFragment = /* wgsl */`
@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
}
`;

/**
 * @description 位置指定テクスチャサンプリング用フラグメントシェーダー
 *              Positioned texture sampling fragment shader
 *
 * @type {string}
 * @constant
 */
export const PositionedTextureFragment = /* wgsl */`
${WgslVertexOutput}

@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return textureSampleLevel(inputTexture, textureSampler, input.texCoord, 0);
}
`;

/**
 * @description ビットマップ同期用フラグメントシェーダー（テクスチャ直接サンプリング）
 *              Bitmap sync fragment shader with direct texture sampling
 *
 * @type {string}
 * @constant
 */
export const BitmapSyncFragment = /* wgsl */`
${WgslVertexOutput}

@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return textureSampleLevel(inputTexture, textureSampler, input.texCoord, 0);
}
`;

/**
 * @description 汎用ブレンドフラグメントシェーダー（Normal/Multiply/Screen/Add）
 *              Generic blend fragment shader supporting Normal, Multiply, Screen, and Add modes
 *
 * @type {string}
 * @constant
 */
export const BlendGenericFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct BlendUniforms {
    blendMode: f32,
}

@group(0) @binding(1) var<uniform> blend: BlendUniforms;
@group(0) @binding(2) var srcSampler: sampler;
@group(0) @binding(3) var srcTexture: texture_2d<f32>;
@group(0) @binding(4) var dstSampler: sampler;
@group(0) @binding(5) var dstTexture: texture_2d<f32>;

fn blendNormal(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    return src;
}

fn blendMultiply(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    return src * dst;
}

fn blendScreen(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    return src + dst - src * dst;
}

fn blendAdd(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    return min(src + dst, vec4<f32>(1.0));
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let src = textureSampleLevel(srcTexture, srcSampler, input.texCoord, 0);
    let dst = textureSampleLevel(dstTexture, dstSampler, input.texCoord, 0);
    var result: vec4<f32>;
    if (blend.blendMode < 0.5) {
        result = blendNormal(src, dst);
    } else if (blend.blendMode < 1.5) {
        result = blendMultiply(src, dst);
    } else if (blend.blendMode < 2.5) {
        result = blendScreen(src, dst);
    } else {
        result = blendAdd(src, dst);
    }
    return result * input.color;
}
`;
