import { WgslVertexOutput } from "../common/SharedWgsl";

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
    return textureSample(inputTexture, textureSampler, uv);
}
`;

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
    let color = textureSample(inputTexture, textureSampler, clampedUv);
    let inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    return select(vec4<f32>(0.0, 0.0, 0.0, 0.0), color, inBounds);
}
`;

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
    let color = textureSample(inputTexture, textureSampler, clampedUv);
    let inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    return select(vec4<f32>(0.0, 0.0, 0.0, 0.0), color, inBounds);
}
`;

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
    var color = textureSample(inputTexture, textureSampler, input.texCoord);

    color = vec4<f32>(color.rgb / max(vec3<f32>(0.0001), vec3<f32>(color.a)), color.a);
    color = clamp(color * ct.mul + ct.add, vec4<f32>(0.0), vec4<f32>(1.0));
    color = vec4<f32>(color.rgb * color.a, color.a);

    return color;
}
`;

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
    var color = textureSample(inputTexture, textureSampler, input.texCoord);

    color = vec4<f32>(color.rgb / max(vec3<f32>(0.0001), vec3<f32>(color.a)), color.a);
    var result = uniforms.matrix * color + uniforms.offset;
    result = clamp(result, vec4<f32>(0.0), vec4<f32>(1.0));
    result = vec4<f32>(result.rgb * result.a, result.a);

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
${WgslVertexOutput}

@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    return textureSample(inputTexture, textureSampler, input.texCoord);
}
`;

export const BitmapSyncFragment = /* wgsl */`
${WgslVertexOutput}

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
