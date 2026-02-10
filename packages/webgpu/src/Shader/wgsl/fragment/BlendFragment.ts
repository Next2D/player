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
    `    let s = step(vec3<f32>(0.5), dstRgb);
    let lo = 2.0 * srcRgb * dstRgb;
    let hi = 1.0 - 2.0 * (1.0 - srcRgb) * (1.0 - dstRgb);
    var c = vec4<f32>(mix(lo, hi, s), src.a * dst.a);`
);

export const HardLightBlendFragment = createBlendFragment(
    `    let s = step(vec3<f32>(0.5), srcRgb);
    let lo = 2.0 * srcRgb * dstRgb;
    let hi = 1.0 - 2.0 * (1.0 - srcRgb) * (1.0 - dstRgb);
    var c = vec4<f32>(mix(lo, hi, s), src.a * dst.a);`
);

export const DifferenceBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(abs(srcRgb - dstRgb), src.a * dst.a);"
);

export const SubtractBlendFragment = createBlendFragment(
    "    var c = vec4<f32>(max(dstRgb - srcRgb, vec3<f32>(0.0)), src.a * dst.a);"
);
