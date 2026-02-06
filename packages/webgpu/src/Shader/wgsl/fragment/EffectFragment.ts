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
    var rawAlpha = blurColor.a;
    if (uniforms.inner > 0.5) {
        rawAlpha = 1.0 - rawAlpha;
    }
    let glowAlpha = clamp(rawAlpha * uniforms.strength, 0.0, 1.0);
    let glowColor = vec4<f32>(uniforms.color.rgb * glowAlpha, uniforms.color.a * glowAlpha);
    if (uniforms.inner > 0.5) {
        let innerGlow = glowColor * baseColor.a;
        if (uniforms.knockout > 0.5) {
            return innerGlow;
        } else {
            return innerGlow + baseColor * (1.0 - glowColor.a);
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
    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
    strength: f32,
    inner: f32,
    knockout: f32,
    hideObject: f32,
}

@group(0) @binding(0) var<uniform> uniforms: DropShadowUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;

fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec4<f32>(0.0, uv.x, 0.0, uv.y), vec4<f32>(uv.x, 1.0, uv.y, 1.0));
    return step(4.0, dot(s, vec4<f32>(1.0, 1.0, 1.0, 1.0)));
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    // WebGL版と同じ: UV変換+isInsideでハード境界クリッピング
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let baseColor = textureSample(baseTexture, textureSampler, baseUV) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    let blur = textureSample(blurTexture, textureSampler, blurUV) * isInside(blurUV);

    // WebGL版と同じ: innerの場合、アルファを反転してエッジのみにシャドウを適用
    var rawAlpha = blur.a;
    if (uniforms.inner > 0.5) {
        rawAlpha = 1.0 - rawAlpha;
    }
    let shadowAlpha = clamp(rawAlpha * uniforms.strength, 0.0, 1.0);
    // WebGL版と同じ: blur = color * blur.a → alphaチャンネルにcolor.a(=alpha)を乗算
    let shadowColor = vec4<f32>(uniforms.color.rgb * shadowAlpha, uniforms.color.a * shadowAlpha);

    if (uniforms.inner > 0.5) {
        // WebGL版: source-atop blend = src * dst.a + dst * (1 - src.a)
        let innerShadow = shadowColor * baseColor.a;
        if (uniforms.knockout > 0.5) {
            return innerShadow;
        } else {
            return innerShadow + baseColor * (1.0 - shadowColor.a);
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

fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec4<f32>(0.0, uv.x, 0.0, uv.y), vec4<f32>(uv.x, 1.0, uv.y, 1.0));
    return step(4.0, dot(s, vec4<f32>(1.0, 1.0, 1.0, 1.0)));
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    // WebGL版と同じ: UV変換+isInsideでハード境界クリッピング
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let base = textureSample(baseTexture, textureSampler, baseUV) * isInside(baseUV);

    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    var blur = textureSample(blurTexture, textureSampler, blurUV) * isInside(blurUV);

    // WebGL版と同じ: gradient glowではinner alpha反転しない
    // (非gradient GlowFilterではinver反転するが、gradient版ではLUTが空間マッピングを制御)
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
        // inner (type = 1)
        // WebGL版: baseを描画後にsource-atop blendでglowColorを合成
        // source-atop: result = src * dst.a + dst * (1 - src.a)
        if (knockout) {
            result = glowColor * base.a;
        } else {
            result = glowColor * base.a + base * (1.0 - glowColor.a);
        }
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

fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec4<f32>(0.0, uv.x, 0.0, uv.y), vec4<f32>(uv.x, 1.0, uv.y, 1.0));
    return step(4.0, dot(s, vec4<f32>(1.0, 1.0, 1.0, 1.0)));
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    // WebGL版と同じ: UV変換+isInsideでハード境界クリッピング
    let baseUV = input.texCoord * uniforms.baseScale - uniforms.baseOffset;
    let base = textureSample(baseTexture, textureSampler, baseUV) * isInside(baseUV);

    // WebGL版と同じ: UV変換+isInsideでブラーサンプリング
    let blurUV = input.texCoord * uniforms.blurScale - uniforms.blurOffset;
    let blur1 = textureSample(blurTexture, textureSampler, blurUV) * isInside(blurUV);

    // WebGL版と同じ: ミラーは出力座標系で反転してからUV変換
    let mirrorUV = (1.0 - input.texCoord) * uniforms.blurScale - uniforms.blurOffset;
    let blur2 = textureSample(blurTexture, textureSampler, mirrorUV) * isInside(mirrorUV);

    var highlightAlpha = blur1.a - blur2.a;
    var shadowAlpha = blur2.a - blur1.a;
    highlightAlpha = clamp(highlightAlpha * uniforms.strength, 0.0, 1.0);
    shadowAlpha = clamp(shadowAlpha * uniforms.strength, 0.0, 1.0);

    let lutCoord = 0.5019607843137255 - 0.5019607843137255 * shadowAlpha + 0.4980392156862745 * highlightAlpha;
    let bevelColor = textureSample(gradientLUT, textureSampler, vec2<f32>(lutCoord, 0.5));

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
        // WebGL版: source-atop blend = src * dst.a + dst * (1 - src.a)
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

export const BevelBaseFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BevelBaseUniforms {
    offset: vec2<f32>,
    _padding: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BevelBaseUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var sourceTexture: texture_2d<f32>;

fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec4<f32>(0.0, uv.x, 0.0, uv.y), vec4<f32>(uv.x, 1.0, uv.y, 1.0));
    return step(4.0, dot(s, vec4<f32>(1.0, 1.0, 1.0, 1.0)));
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let original = textureSample(sourceTexture, textureSampler, input.texCoord);
    let shiftedUV = input.texCoord - uniforms.offset;
    let shifted = textureSample(sourceTexture, textureSampler, shiftedUV) * isInside(shiftedUV);
    return original * (1.0 - shifted.a);
}
`;
