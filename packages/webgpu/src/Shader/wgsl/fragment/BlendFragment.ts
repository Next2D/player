export const MultiplyBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let c = src * dst;
    return a + b + c;
}
`;

export const ScreenBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    // Screen: 1 - (1 - src) * (1 - dst) = src + dst - src * dst
    var c = vec4<f32>(srcRgb + dstRgb - srcRgb * dstRgb, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const LightenBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    var c = vec4<f32>(max(srcRgb, dstRgb), src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const DarkenBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    var c = vec4<f32>(min(srcRgb, dstRgb), src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const OverlayBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    var overlayRgb: vec3<f32>;
    if (dstRgb.r < 0.5) {
        overlayRgb.r = 2.0 * srcRgb.r * dstRgb.r;
    } else {
        overlayRgb.r = 1.0 - 2.0 * (1.0 - srcRgb.r) * (1.0 - dstRgb.r);
    }
    if (dstRgb.g < 0.5) {
        overlayRgb.g = 2.0 * srcRgb.g * dstRgb.g;
    } else {
        overlayRgb.g = 1.0 - 2.0 * (1.0 - srcRgb.g) * (1.0 - dstRgb.g);
    }
    if (dstRgb.b < 0.5) {
        overlayRgb.b = 2.0 * srcRgb.b * dstRgb.b;
    } else {
        overlayRgb.b = 1.0 - 2.0 * (1.0 - srcRgb.b) * (1.0 - dstRgb.b);
    }
    var c = vec4<f32>(overlayRgb, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const HardLightBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    var hardLightRgb: vec3<f32>;
    if (srcRgb.r < 0.5) {
        hardLightRgb.r = 2.0 * srcRgb.r * dstRgb.r;
    } else {
        hardLightRgb.r = 1.0 - 2.0 * (1.0 - srcRgb.r) * (1.0 - dstRgb.r);
    }
    if (srcRgb.g < 0.5) {
        hardLightRgb.g = 2.0 * srcRgb.g * dstRgb.g;
    } else {
        hardLightRgb.g = 1.0 - 2.0 * (1.0 - srcRgb.g) * (1.0 - dstRgb.g);
    }
    if (srcRgb.b < 0.5) {
        hardLightRgb.b = 2.0 * srcRgb.b * dstRgb.b;
    } else {
        hardLightRgb.b = 1.0 - 2.0 * (1.0 - srcRgb.b) * (1.0 - dstRgb.b);
    }
    var c = vec4<f32>(hardLightRgb, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const DifferenceBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    var c = vec4<f32>(abs(srcRgb - dstRgb), src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const SubtractBlendFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    colorTransform: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
@group(0) @binding(3) var texture1: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(texture1, sampler0, input.texCoord);
    var dst = textureSample(texture0, sampler0, input.texCoord);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
    var c = vec4<f32>(max(dstRgb - srcRgb, vec3<f32>(0.0)), src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
