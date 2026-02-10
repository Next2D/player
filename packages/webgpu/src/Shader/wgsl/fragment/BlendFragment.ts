/**
 * @description ブレンドシェーダー共通ヘッダー
 */
const BLEND_HEADER = /* wgsl */`struct VertexOutput {
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
`;

/**
 * @description alpha guard 付きブレンドシェーダーを生成
 */
const createBlendFragment = (blendLogic: string): string =>
    BLEND_HEADER + /* wgsl */`
@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSampleLevel(texture1, sampler0, input.texCoord, 0);
    var dst = textureSampleLevel(texture0, sampler0, input.texCoord, 0);
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    var srcRgb = src.rgb / src.a;
    var dstRgb = dst.rgb / dst.a;
${blendLogic}
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;

export const MultiplyBlendFragment = BLEND_HEADER + /* wgsl */`
@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSampleLevel(texture1, sampler0, input.texCoord, 0);
    var dst = textureSampleLevel(texture0, sampler0, input.texCoord, 0);
    src = src * uniforms.colorTransform + vec4<f32>(uniforms.addColor.rgb, 0.0);
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let c = src * dst;
    return a + b + c;
}
`;

export const ScreenBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(srcRgb + dstRgb - srcRgb * dstRgb, src.a * dst.a);"
);

export const LightenBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(max(srcRgb, dstRgb), src.a * dst.a);"
);

export const DarkenBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(min(srcRgb, dstRgb), src.a * dst.a);"
);

export const OverlayBlendFragment = createBlendFragment(
    `    var overlayRgb: vec3<f32>;
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
    var c = vec4<f32>(overlayRgb, src.a * dst.a);`
);

export const HardLightBlendFragment = createBlendFragment(
    `    var hardLightRgb: vec3<f32>;
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
    var c = vec4<f32>(hardLightRgb, src.a * dst.a);`
);

export const DifferenceBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(abs(srcRgb - dstRgb), src.a * dst.a);"
);

export const SubtractBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(max(dstRgb - srcRgb, vec3<f32>(0.0)), src.a * dst.a);"
);
