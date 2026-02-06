export const GlowFilterFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct GlowUniforms {
    color: vec4<f32>,
    strength: f32,
    inner: f32,
    knockout: f32,
    _padding: f32,
}

@group(0) @binding(0) var<uniform> uniforms: GlowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let blurColor = textureSample(blurTexture, textureSampler, input.texCoord);
    let baseColor = textureSample(baseTexture, textureSampler, input.texCoord);
    let glowAlpha = clamp(blurColor.a * uniforms.strength, 0.0, 1.0);
    let glowColor = vec4<f32>(uniforms.color.rgb * glowAlpha, glowAlpha);
    if (uniforms.inner > 0.5) {
        let innerGlow = glowColor * baseColor.a;
        if (uniforms.knockout > 0.5) {
            return innerGlow;
        } else {
            return baseColor + innerGlow * (1.0 - baseColor.a);
        }
    } else {
        if (uniforms.knockout > 0.5) {
            return glowColor * (1.0 - baseColor.a);
        } else {
            return baseColor + glowColor * (1.0 - baseColor.a);
        }
    }
}
`;

export const DropShadowFilterFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct DropShadowUniforms {
    color: vec4<f32>,
    offset: vec2<f32>,
    strength: f32,
    inner: f32,
    knockout: f32,
    hideObject: f32,
    _padding: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: DropShadowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let baseColor = textureSample(baseTexture, textureSampler, input.texCoord);
    let shadowUV = input.texCoord + uniforms.offset;
    let blurColor = textureSample(blurTexture, textureSampler, shadowUV);
    let shadowAlpha = clamp(blurColor.a * uniforms.strength, 0.0, 1.0);
    let shadowColor = vec4<f32>(uniforms.color.rgb * shadowAlpha, shadowAlpha);
    if (uniforms.inner > 0.5) {
        let innerShadow = shadowColor * baseColor.a;
        if (uniforms.knockout > 0.5) {
            return innerShadow;
        } else {
            return baseColor * (1.0 - shadowAlpha) + innerShadow;
        }
    } else {
        if (uniforms.hideObject > 0.5) {
            return shadowColor;
        } else if (uniforms.knockout > 0.5) {
            return shadowColor * (1.0 - baseColor.a);
        } else {
            return shadowColor * (1.0 - baseColor.a) + baseColor;
        }
    }
}
`;

export const GradientGlowFilterFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct GradientGlowUniforms {
    strength: f32,
    inner: f32,
    knockout: f32,
    glowType: f32,
}

@group(0) @binding(0) var<uniform> uniforms: GradientGlowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
@group(0) @binding(4) var gradientLUT: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var blur = textureSample(blurTexture, textureSampler, input.texCoord);
    let base = textureSample(baseTexture, textureSampler, input.texCoord);
    let isInner = uniforms.inner > 0.5;
    if (isInner) {
        blur.a = 1.0 - blur.a;
    }
    blur.a = clamp(blur.a * uniforms.strength, 0.0, 1.0);
    let glowColor = textureSample(gradientLUT, textureSampler, vec2<f32>(blur.a, 0.5));
    var result: vec4<f32>;
    let glowType = uniforms.glowType;
    let knockout = uniforms.knockout > 0.5;
    if (glowType < 0.5) {
        if (knockout) {
            result = glowColor;
        } else {
            result = base - base * glowColor.a + glowColor;
        }
    } else if (glowType < 1.5) {
        result = glowColor;
    } else {
        if (knockout) {
            result = glowColor - glowColor * base.a;
        } else {
            result = base + glowColor - glowColor * base.a;
        }
    }
    return result;
}
`;

export const GradientBevelFilterFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct GradientBevelUniforms {
    strength: f32,
    inner: f32,
    knockout: f32,
    bevelType: f32,
}

@group(0) @binding(0) var<uniform> uniforms: GradientBevelUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
@group(0) @binding(4) var gradientLUT: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let base = textureSample(baseTexture, textureSampler, input.texCoord);
    let blur1 = textureSample(blurTexture, textureSampler, input.texCoord);
    let blur2 = textureSample(blurTexture, textureSampler, 1.0 - input.texCoord);
    var highlightAlpha = blur1.a - blur2.a;
    var shadowAlpha = blur2.a - blur1.a;
    highlightAlpha *= uniforms.strength;
    shadowAlpha *= uniforms.strength;
    highlightAlpha = clamp(highlightAlpha, 0.0, 1.0);
    shadowAlpha = clamp(shadowAlpha, 0.0, 1.0);
    let lutCoord = 0.5019607843137255 - 0.5019607843137255 * shadowAlpha + 0.4980392156862745 * highlightAlpha;
    let bevelColor = textureSample(gradientLUT, textureSampler, vec2<f32>(lutCoord, 0.5));
    var result: vec4<f32>;
    let bevelType = uniforms.bevelType;
    let knockout = uniforms.knockout > 0.5;
    if (bevelType < 0.5) {
        if (knockout) {
            result = bevelColor;
        } else {
            result = base - base * bevelColor.a + bevelColor;
        }
    } else if (bevelType < 1.5) {
        // inner (type = 1)
        // WebGL版: base描画後にsource-atop blendでbevelColorを合成
        // source-atop: result = src * dst.a + dst * (1 - src.a)
        if (knockout) {
            result = bevelColor * base.a;
        } else {
            result = bevelColor * base.a + base * (1.0 - bevelColor.a);
        }
    } else {
        if (knockout) {
            result = bevelColor - bevelColor * base.a;
        } else {
            result = base + bevelColor - bevelColor * base.a;
        }
    }
    return result;
}
`;

export const BevelFilterFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BevelUniforms {
    highlightColor: vec4<f32>,
    shadowColor: vec4<f32>,
    strength: f32,
    inner: f32,
    knockout: f32,
    bevelType: f32,
}

@group(0) @binding(0) var<uniform> uniforms: BevelUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let base = textureSample(baseTexture, textureSampler, input.texCoord);

    // WebGL版と同様: blur1は通常座標、blur2は反転座標でサンプル
    let blur1 = textureSample(blurTexture, textureSampler, input.texCoord);
    let blur2 = textureSample(blurTexture, textureSampler, 1.0 - input.texCoord);

    // ハイライトとシャドウのアルファを計算
    var highlightAlpha = blur1.a - blur2.a;
    var shadowAlpha = blur2.a - blur1.a;

    // strengthを適用
    highlightAlpha *= uniforms.strength;
    shadowAlpha *= uniforms.strength;

    // クランプ
    highlightAlpha = clamp(highlightAlpha, 0.0, 1.0);
    shadowAlpha = clamp(shadowAlpha, 0.0, 1.0);

    // ベベルカラーを計算
    let bevelColor = uniforms.highlightColor * highlightAlpha + uniforms.shadowColor * shadowAlpha;

    // タイプに応じて合成
    // WebGL版ではinner型にsource-atop blending（result = src * dst.a + dst * (1 - src.a)）を使用
    // WebGPU版では単一パスで合成するため、シェーダー内で同等の計算を行う
    var result: vec4<f32>;
    let bevelType = uniforms.bevelType;
    let knockout = uniforms.knockout > 0.5;

    if (bevelType < 0.5) {
        // full (type = 0)
        if (knockout) {
            result = bevelColor;
        } else {
            result = base - base * bevelColor.a + bevelColor;
        }
    } else if (bevelType < 1.5) {
        // inner (type = 1)
        // WebGL版: base描画後にsource-atop blendでbevelColorを合成
        // source-atop: result = src * dst.a + dst * (1 - src.a)
        // = bevelColor * base.a + base * (1 - bevelColor.a)
        // これによりbase.a=0の領域にはベベルが漏れない
        if (knockout) {
            result = bevelColor * base.a;
        } else {
            result = bevelColor * base.a + base * (1.0 - bevelColor.a);
        }
    } else {
        // outer (type = 2)
        if (knockout) {
            result = bevelColor - bevelColor * base.a;
        } else {
            result = base + bevelColor - bevelColor * base.a;
        }
    }

    return result;
}
`;
