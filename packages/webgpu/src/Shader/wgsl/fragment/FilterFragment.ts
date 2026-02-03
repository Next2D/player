export const TextureCopyFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

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
    return textureSample(inputTexture, textureSampler, uv);
}
`;

export const BlurTextureCopyFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

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
    let color = textureSample(inputTexture, textureSampler, clampedUv);
    let inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    return select(vec4<f32>(0.0, 0.0, 0.0, 0.0), color, inBounds);
}
`;

export const FilterOutputFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct CopyUniforms {
    scale: vec2<f32>,
    offset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: CopyUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let filterStart = uniforms.offset;
    let filterEnd = uniforms.offset + uniforms.scale;
    let uv = (input.texCoord - filterStart) / uniforms.scale;
    let clampedUv = clamp(uv, vec2<f32>(0.0), vec2<f32>(1.0));
    let color = textureSample(inputTexture, textureSampler, clampedUv);
    let inBounds = input.texCoord.x >= filterStart.x && input.texCoord.x <= filterEnd.x &&
                   input.texCoord.y >= filterStart.y && input.texCoord.y <= filterEnd.y;
    return select(vec4<f32>(0.0, 0.0, 0.0, 0.0), color, inBounds);
}
`;

export const ColorMatrixFilterFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct ColorMatrixUniforms {
    matrix: mat4x4<f32>,
    offset: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ColorMatrixUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var color = textureSample(inputTexture, textureSampler, input.texCoord);
    var result = uniforms.matrix * color + uniforms.offset;
    result = clamp(result, vec4<f32>(0.0), vec4<f32>(1.0));
    return result;
}
`;

export const NodeClearFragment = /* wgsl */`
@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
}
`;

export const PositionedTextureFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return textureSample(inputTexture, textureSampler, input.texCoord);
}
`;

// Bitmap同期用fragment shader
// vertex shaderで計算されたUV座標をそのまま使用
export const BitmapSyncFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return textureSample(inputTexture, textureSampler, input.texCoord);
}
`;

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
    let src = textureSample(srcTexture, srcSampler, input.texCoord);
    let dst = textureSample(dstTexture, dstSampler, input.texCoord);
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
