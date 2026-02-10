import { WgslIsInside, WgslVertexOutput } from "../common/SharedWgsl";

export const GlowFilterFragment = /* wgsl */`
${WgslVertexOutput}

override IS_INNER: u32 = 0u;
override IS_KNOCKOUT: u32 = 0u;

struct GlowUniforms {
    color: vec4<f32>,
    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
    strength: f32,
    _padding1: f32,
    _padding2: f32,
    _padding3: f32,
}

@group(0) @binding(0) var<uniform> uniforms: GlowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let baseColor = textureSampleLevel(baseTexture, textureSampler, baseUV, 0) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    let blurColor = textureSampleLevel(blurTexture, textureSampler, blurUV, 0) * isInside(blurUV);

    var rawAlpha = blurColor.a;
    if (IS_INNER == 1u) {
        rawAlpha = 1.0 - rawAlpha;
    }
    let glowAlpha = clamp(rawAlpha * uniforms.strength, 0.0, 1.0);
    let glowColor = vec4<f32>(uniforms.color.rgb * glowAlpha, uniforms.color.a * glowAlpha);
    if (IS_INNER == 1u) {
        let innerGlow = glowColor * baseColor.a;
        if (IS_KNOCKOUT == 1u) {
            return innerGlow;
        } else {
            return innerGlow + baseColor * (1.0 - glowColor.a);
        }
    } else {
        if (IS_KNOCKOUT == 1u) {
            return glowColor * (1.0 - baseColor.a);
        } else {
            return baseColor + glowColor * (1.0 - baseColor.a);
        }
    }
}
`;

export const DropShadowFilterFragment = /* wgsl */`
${WgslVertexOutput}

override IS_INNER: u32 = 0u;
override IS_KNOCKOUT: u32 = 0u;
override IS_HIDE_OBJECT: u32 = 0u;

struct DropShadowUniforms {
    color: vec4<f32>,
    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
    strength: f32,
    _padding1: f32,
    _padding2: f32,
    _padding3: f32,
}

@group(0) @binding(0) var<uniform> uniforms: DropShadowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let baseColor = textureSampleLevel(baseTexture, textureSampler, baseUV, 0) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    let blur = textureSampleLevel(blurTexture, textureSampler, blurUV, 0) * isInside(blurUV);

    var rawAlpha = blur.a;
    if (IS_INNER == 1u) {
        rawAlpha = 1.0 - rawAlpha;
    }
    let shadowAlpha = clamp(rawAlpha * uniforms.strength, 0.0, 1.0);
    let shadowColor = vec4<f32>(uniforms.color.rgb * shadowAlpha, uniforms.color.a * shadowAlpha);

    if (IS_INNER == 1u) {
        let innerShadow = shadowColor * baseColor.a;
        if (IS_KNOCKOUT == 1u) {
            return innerShadow;
        } else {
            return innerShadow + baseColor * (1.0 - shadowColor.a);
        }
    } else {
        if (IS_HIDE_OBJECT == 1u) {
            return shadowColor;
        } else if (IS_KNOCKOUT == 1u) {
            return shadowColor * (1.0 - baseColor.a);
        } else {
            return shadowColor * (1.0 - baseColor.a) + baseColor;
        }
    }
}
`;

export const GradientGlowFilterFragment = /* wgsl */`
${WgslVertexOutput}

override GLOW_TYPE: u32 = 0u;
override IS_KNOCKOUT: u32 = 0u;

struct GradientGlowUniforms {
    strength: f32,
    _padding1: f32,
    _padding2: f32,
    _padding3: f32,
    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: GradientGlowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
@group(0) @binding(4) var gradientLUT: texture_2d<f32>;
${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let base = textureSampleLevel(baseTexture, textureSampler, baseUV, 0) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    var blur = textureSampleLevel(blurTexture, textureSampler, blurUV, 0) * isInside(blurUV);

    blur.a = clamp(blur.a * uniforms.strength, 0.0, 1.0);
    let glowColor = textureSampleLevel(gradientLUT, textureSampler, vec2<f32>(blur.a, 0.5), 0);
    var result: vec4<f32>;
    if (GLOW_TYPE == 0u) {
        if (IS_KNOCKOUT == 1u) {
            result = glowColor;
        } else {
            result = base - base * glowColor.a + glowColor;
        }
    } else if (GLOW_TYPE == 1u) {
        if (IS_KNOCKOUT == 1u) {
            result = glowColor * base.a;
        } else {
            result = glowColor * base.a + base * (1.0 - glowColor.a);
        }
    } else {
        if (IS_KNOCKOUT == 1u) {
            result = glowColor - glowColor * base.a;
        } else {
            result = base + glowColor - glowColor * base.a;
        }
    }
    return result;
}
`;

export const GradientBevelFilterFragment = /* wgsl */`
${WgslVertexOutput}

override BEVEL_TYPE: u32 = 0u;
override IS_KNOCKOUT: u32 = 0u;

struct GradientBevelUniforms {
    strength: f32,
    _padding1: f32,
    _padding2: f32,
    _padding3: f32,
    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: GradientBevelUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
@group(0) @binding(4) var gradientLUT: texture_2d<f32>;
${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let base = textureSampleLevel(baseTexture, textureSampler, baseUV, 0) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    let blur1 = textureSampleLevel(blurTexture, textureSampler, blurUV, 0) * isInside(blurUV);

    let mirrorUV = (1.0 - input.texCoord) * uniforms.blurScale - uniforms.blurOffset;
    let blur2 = textureSampleLevel(blurTexture, textureSampler, mirrorUV, 0) * isInside(mirrorUV);

    var highlightAlpha = blur1.a - blur2.a;
    var shadowAlpha = blur2.a - blur1.a;
    highlightAlpha = clamp(highlightAlpha * uniforms.strength, 0.0, 1.0);
    shadowAlpha = clamp(shadowAlpha * uniforms.strength, 0.0, 1.0);

    let lutCoord = 0.5019607843137255 - 0.5019607843137255 * shadowAlpha + 0.4980392156862745 * highlightAlpha;
    let bevelColor = textureSampleLevel(gradientLUT, textureSampler, vec2<f32>(lutCoord, 0.5), 0);

    var result: vec4<f32>;
    if (BEVEL_TYPE == 0u) {
        if (IS_KNOCKOUT == 1u) {
            result = bevelColor;
        } else {
            result = base - base * bevelColor.a + bevelColor;
        }
    } else if (BEVEL_TYPE == 1u) {
        if (IS_KNOCKOUT == 1u) {
            result = bevelColor * base.a;
        } else {
            result = bevelColor * base.a + base * (1.0 - bevelColor.a);
        }
    } else {
        if (IS_KNOCKOUT == 1u) {
            result = bevelColor - bevelColor * base.a;
        } else {
            result = base + bevelColor - bevelColor * base.a;
        }
    }

    return result;
}
`;

export const BevelFilterFragment = /* wgsl */`
${WgslVertexOutput}

override BEVEL_TYPE: u32 = 0u;
override IS_KNOCKOUT: u32 = 0u;

struct BevelUniforms {
    highlightColor: vec4<f32>,
    shadowColor: vec4<f32>,
    strength: f32,
    _padding1: f32,
    _padding2: f32,
    _padding3: f32,
    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BevelUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let base = textureSampleLevel(baseTexture, textureSampler, baseUV, 0) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    let blur1 = textureSampleLevel(blurTexture, textureSampler, blurUV, 0) * isInside(blurUV);

    let mirrorUV = (1.0 - input.texCoord) * uniforms.blurScale - uniforms.blurOffset;
    let blur2 = textureSampleLevel(blurTexture, textureSampler, mirrorUV, 0) * isInside(mirrorUV);

    var highlightAlpha = blur1.a - blur2.a;
    var shadowAlpha = blur2.a - blur1.a;
    highlightAlpha = clamp(highlightAlpha * uniforms.strength, 0.0, 1.0);
    shadowAlpha = clamp(shadowAlpha * uniforms.strength, 0.0, 1.0);

    let bevelColor = uniforms.highlightColor * highlightAlpha + uniforms.shadowColor * shadowAlpha;
    var result: vec4<f32>;
    if (BEVEL_TYPE == 0u) {
        if (IS_KNOCKOUT == 1u) {
            result = bevelColor;
        } else {
            result = base - base * bevelColor.a + bevelColor;
        }
    } else if (BEVEL_TYPE == 1u) {
        if (IS_KNOCKOUT == 1u) {
            result = bevelColor * base.a;
        } else {
            result = bevelColor * base.a + base * (1.0 - bevelColor.a);
        }
    } else {
        if (IS_KNOCKOUT == 1u) {
            result = bevelColor - bevelColor * base.a;
        } else {
            result = base + bevelColor - bevelColor * base.a;
        }
    }

    return result;
}
`;

export const BevelBaseFragment = /* wgsl */`
${WgslVertexOutput}

struct BevelBaseUniforms {
    offset: vec2<f32>,
    _padding: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BevelBaseUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var sourceTexture: texture_2d<f32>;
${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let original = textureSampleLevel(sourceTexture, textureSampler, input.texCoord, 0);
    let shiftedUV = input.texCoord - uniforms.offset;
    let shifted = textureSampleLevel(sourceTexture, textureSampler, shiftedUV, 0) * isInside(shiftedUV);
    return original * (1.0 - shifted.a);
}
`;
