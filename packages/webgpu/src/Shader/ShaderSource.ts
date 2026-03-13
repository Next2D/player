import { FillVertex } from "./wgsl/vertex/FillVertex";
import { StencilWriteVertex, StencilFillVertex } from "./wgsl/vertex/StencilVertex";
import { MaskVertex } from "./wgsl/vertex/MaskVertex";
import { BasicVertex } from "./wgsl/vertex/BasicVertex";
import { InstancedVertex } from "./wgsl/vertex/InstancedVertex";
import { GradientFillVertex } from "./wgsl/vertex/GradientVertex";
import { BitmapFillVertex } from "./wgsl/vertex/BitmapVertex";
import { BlurFilterVertex, NodeClearVertex, PositionedTextureVertex, BitmapSyncVertex, TextureScaleVertex, TextureScaleBlendVertex, ComplexBlendScaleVertex, ComplexBlendVertex, ComplexBlendCopyVertex, ComplexBlendOutputVertex, FilterComplexBlendOutputVertex } from "./wgsl/vertex/FilterVertex";

import { FillFragment } from "./wgsl/fragment/FillFragment";
import { StencilWriteFragment, StencilFillFragment } from "./wgsl/fragment/StencilFragment";
import { MaskFragment } from "./wgsl/fragment/MaskFragment";
import { BasicFragment, TextureFragment } from "./wgsl/fragment/BasicFragment";
import { InstancedFragment } from "./wgsl/fragment/InstancedFragment";
import { GradientFillFragment, GradientFillStencilFragment, GradientFragment } from "./wgsl/fragment/GradientFragment";
import { BitmapFillFragment } from "./wgsl/fragment/BitmapFragment";
import {
    TextureCopyFragment,
    BlurTextureCopyFragment,
    FilterOutputFragment,
    ColorTransformFragment,
    YFlipColorTransformFragment,
    ColorMatrixFilterFragment,
    NodeClearFragment,
    PositionedTextureFragment,
    BlendGenericFragment,
    BitmapSyncFragment
} from "./wgsl/fragment/FilterFragment";
import {
    GlowFilterFragment,
    DropShadowFilterFragment,
    GradientGlowFilterFragment,
    GradientBevelFilterFragment,
    BevelFilterFragment,
    BevelBaseFragment
} from "./wgsl/fragment/EffectFragment";
import { WgslIsInside, WgslVertexOutput } from "./wgsl/common/SharedWgsl";

export class ShaderSource
{
    static getFillVertexShader (): string
    {
        return FillVertex;
    }

    static getFillFragmentShader (): string
    {
        return FillFragment;
    }

    static getStencilWriteVertexShader (): string
    {
        return StencilWriteVertex;
    }

    static getStencilWriteFragmentShader (): string
    {
        return StencilWriteFragment;
    }

    static getStencilFillVertexShader (): string
    {
        return StencilFillVertex;
    }

    static getStencilFillFragmentShader (): string
    {
        return StencilFillFragment;
    }

    static getMaskVertexShader (): string
    {
        return MaskVertex;
    }

    static getMaskFragmentShader (): string
    {
        return MaskFragment;
    }

    static getBasicVertexShader (): string
    {
        return BasicVertex;
    }

    static getBasicFragmentShader (): string
    {
        return BasicFragment;
    }

    static getTextureFragmentShader (): string
    {
        return TextureFragment;
    }

    static getInstancedVertexShader (): string
    {
        return InstancedVertex;
    }

    static getInstancedFragmentShader (): string
    {
        return InstancedFragment;
    }

    static getGradientFillVertexShader (): string
    {
        return GradientFillVertex;
    }

    static getGradientFillFragmentShader (): string
    {
        return GradientFillFragment;
    }

    static getGradientFillStencilFragmentShader (): string
    {
        return GradientFillStencilFragment;
    }

    static getGradientFragmentShader (): string
    {
        return GradientFragment;
    }

    static getBitmapFillVertexShader (): string
    {
        return BitmapFillVertex;
    }

    static getBitmapFillFragmentShader (): string
    {
        return BitmapFillFragment;
    }

    static getBlendFragmentShader (): string
    {
        return BlendGenericFragment;
    }

    static getBlurFilterVertexShader (): string
    {
        return BlurFilterVertex;
    }

    static getBitmapSyncVertexShader (): string
    {
        return BitmapSyncVertex;
    }

    static getBitmapSyncFragmentShader (): string
    {
        return BitmapSyncFragment;
    }

    static getBlurFilterFragmentShader (halfBlur: number): string
    {
        const halfBlurFixed = halfBlur.toFixed(1);

        return /* wgsl */`
${WgslVertexOutput}

struct BlurUniforms {
    offset: vec2<f32>,
    fraction: f32,
    samples: f32,
}

@group(0) @binding(0) var<uniform> uniforms: BlurUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var inputTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let offset = uniforms.offset;
    let fraction = uniforms.fraction;
    let samples = uniforms.samples;
    var color = textureSample(inputTexture, textureSampler, input.texCoord);
    for (var i: f32 = 1.0; i < ${halfBlurFixed}; i += 1.0) {
        color += textureSample(inputTexture, textureSampler, input.texCoord + offset * i);
        color += textureSample(inputTexture, textureSampler, input.texCoord - offset * i);
    }
    color += textureSample(inputTexture, textureSampler, input.texCoord + offset * ${halfBlurFixed}) * fraction;
    color += textureSample(inputTexture, textureSampler, input.texCoord - offset * ${halfBlurFixed}) * fraction;
    color /= samples;
    return color;
}
`;
    }

    static getTextureCopyFragmentShader (): string
    {
        return TextureCopyFragment;
    }

    static getBlurTextureCopyFragmentShader (): string
    {
        return BlurTextureCopyFragment;
    }

    static getFilterOutputFragmentShader (): string
    {
        return FilterOutputFragment;
    }

    static getColorTransformFragmentShader (): string
    {
        return ColorTransformFragment;
    }

    static getYFlipColorTransformFragmentShader (): string
    {
        return YFlipColorTransformFragment;
    }

    static getColorMatrixFilterFragmentShader (): string
    {
        return ColorMatrixFilterFragment;
    }

    static getGlowFilterFragmentShader (): string
    {
        return GlowFilterFragment;
    }

    static getDropShadowFilterFragmentShader (): string
    {
        return DropShadowFilterFragment;
    }

    static getGradientGlowFilterFragmentShader (): string
    {
        return GradientGlowFilterFragment;
    }

    static getGradientBevelFilterFragmentShader (): string
    {
        return GradientBevelFilterFragment;
    }

    static getBevelFilterFragmentShader (): string
    {
        return BevelFilterFragment;
    }

    static getBevelBaseFragmentShader (): string
    {
        return BevelBaseFragment;
    }

    static getConvolutionFilterFragmentShader (
        matrixX: number,
        matrixY: number,
        preserveAlpha: boolean = true,
        clamp: boolean = true
    ): string
    {
        const halfX = Math.floor(matrixX * 0.5);
        const halfY = Math.floor(matrixY * 0.5);
        const size = matrixX * matrixY;

        let matrixStatement = "";
        for (let idx = 0; idx < size; idx++) {
            matrixStatement += `
    result = result + getWeightedColor(${idx}, getMatrixWeight(${idx}));`;
        }

        const preserveAlphaStatement = preserveAlpha
            ? "result.a = textureSample(sourceTexture, sourceSampler, input.texCoord).a;"
            : "";

        const clampStatement = clamp
            ? ""
            : `
    let substituteColor = uniforms.substituteColor;
    color = mix(substituteColor, color, isInside(uv));`;

        return `
struct ConvolutionUniforms {
    rcpSize: vec2<f32>,
    rcpDivisor: f32,
    bias: f32,
    substituteColor: vec4<f32>,
    matrix: array<vec4<f32>, ${Math.ceil(size / 4)}>,
}

@group(0) @binding(0) var<uniform> uniforms: ConvolutionUniforms;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(2) var sourceTexture: texture_2d<f32>;

${WgslVertexOutput}

${WgslIsInside}

fn getMatrixWeight(index: i32) -> f32 {
    let vecIndex = index / 4;
    let component = index % 4;
    let vec = uniforms.matrix[vecIndex];
    if (component == 0) { return vec.x; }
    else if (component == 1) { return vec.y; }
    else if (component == 2) { return vec.z; }
    else { return vec.w; }
}

fn getWeightedColor(i: i32, weight: f32) -> vec4<f32> {
    let rcpSize = uniforms.rcpSize;
    let iDivX = i / ${matrixX};
    let iModX = i - ${matrixX} * iDivX;
    let offset = vec2<f32>(f32(iModX - ${halfX}), f32(${halfY} - iDivX));
    var uv = input.texCoord + offset * rcpSize;
    var color = textureSample(sourceTexture, sourceSampler, uv);
    color = vec4<f32>(color.rgb / max(0.0001, color.a), color.a);
    ${clampStatement}
    return color * weight;
}

var<private> input: VertexOutput;

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(1.0, 1.0)
    );
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(1.0, 0.0)
    );
    var output: VertexOutput;
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}

@fragment
fn fs_main(fragInput: VertexOutput) -> @location(0) vec4<f32> {
    input = fragInput;
    let rcpDivisor = uniforms.rcpDivisor;
    let bias = uniforms.bias;
    var result = vec4<f32>(0.0);
    ${matrixStatement}
    result = clamp(result * rcpDivisor + bias, vec4<f32>(0.0), vec4<f32>(1.0));
    ${preserveAlphaStatement}
    result = vec4<f32>(result.rgb * result.a, result.a);
    return result;
}
`;
    }

    static getComplexBlendFragmentShader (): string
    {
        return ShaderSource.getUnifiedComplexBlendFragmentShader();
    }

    static getBlendModeIndex (blendMode: string): number
    {
        switch (blendMode) {
            case "subtract":  return 0;
            case "multiply":  return 1;
            case "lighten":   return 2;
            case "darken":    return 3;
            case "overlay":   return 4;
            case "hardlight": return 5;
            case "difference": return 6;
            case "invert":    return 7;
            default:          return 1;
        }
    }

    static getUnifiedComplexBlendFragmentShader (): string
    {
        return /* wgsl */`
${WgslVertexOutput}

struct BlendUniforms {
    mulColor: vec4<f32>,
    addColor: vec4<f32>,
    blendMode: f32,
    _pad0: f32,
    _pad1: f32,
    _pad2: f32,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var dstTexture: texture_2d<f32>;
@group(0) @binding(3) var srcTexture: texture_2d<f32>;

fn blend(src: vec4<f32>, dst: vec4<f32>, mode: i32) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    let a = src - src * dst.a;
    let b = dst - dst * src.a;

    if (mode == 1) {
        let c = src * dst;
        return a + b + c;
    }

    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;

    var blended: vec3<f32>;

    switch (mode) {
        case 0: {
            blended = dstRgb - srcRgb;
        }
        case 2: {
            blended = mix(srcRgb, dstRgb, step(srcRgb, dstRgb));
        }
        case 3: {
            blended = mix(srcRgb, dstRgb, step(dstRgb, srcRgb));
        }
        case 4: {
            let mul = srcRgb * dstRgb;
            let c1 = 2.0 * mul;
            let c2 = 2.0 * (srcRgb + dstRgb - mul) - 1.0;
            blended = mix(c1, c2, step(vec3<f32>(0.5), dstRgb));
        }
        case 5: {
            let mul = srcRgb * dstRgb;
            let c1 = 2.0 * mul;
            let c2 = 2.0 * (srcRgb + dstRgb - mul) - 1.0;
            blended = mix(c1, c2, step(vec3<f32>(0.5), srcRgb));
        }
        case 6: {
            blended = abs(srcRgb - dstRgb);
        }
        case 7: {
            let ib = dst - dst * src.a;
            let ic = vec4<f32>(src.a - dst.rgb * src.a, src.a);
            return ib + ic;
        }
        default: {
            blended = srcRgb;
        }
    }

    var c = vec4<f32>(blended, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var dst = textureSample(dstTexture, textureSampler, input.texCoord);
    var src = textureSample(srcTexture, textureSampler, input.texCoord);
    let mul = uniforms.mulColor;
    let add = uniforms.addColor;
    if (mul.x != 1.0 || mul.y != 1.0 || mul.z != 1.0 || mul.w != 1.0
        || add.x != 0.0 || add.y != 0.0 || add.z != 0.0) {
        src = vec4<f32>(src.rgb / max(vec3<f32>(0.0001), vec3<f32>(src.a)), src.a);
        src = clamp(src * mul + add, vec4<f32>(0.0), vec4<f32>(1.0));
        src = vec4<f32>(src.rgb * src.a, src.a);
    }
    return blend(src, dst, i32(uniforms.blendMode));
}
`;
    }

    static getDisplacementMapFilterFragmentShader (
        componentX: number,
        componentY: number,
        mode: number
    ): string
    {
        let cx: string;
        let cy: string;

        switch (componentX) {
            case 1:
                cx = "mapColor.r";
                break;
            case 2:
                cx = "mapColor.g";
                break;
            case 4:
                cx = "mapColor.b";
                break;
            case 8:
                cx = "mapColor.a";
                break;
            default:
                cx = "0.5";
                break;
        }

        switch (componentY) {
            case 1:
                cy = "mapColor.r";
                break;
            case 2:
                cy = "mapColor.g";
                break;
            case 4:
                cy = "mapColor.b";
                break;
            case 8:
                cy = "mapColor.a";
                break;
            default:
                cy = "0.5";
                break;
        }

        let modeStatement: string;
        let needsSubstituteColor = false;

        switch (mode) {
            case 0:
                modeStatement = `
sourceColor = textureSample(srcTexture, textureSampler, uv);
`;
                break;
            case 1:
                needsSubstituteColor = true;
                modeStatement = `
sourceColor = mix(uniforms.substituteColor, textureSample(srcTexture, textureSampler, uv), isInside(uv));
`;
                break;
            case 2:
                modeStatement = `
sourceColor = textureSample(srcTexture, textureSampler, fract(uv));
`;
                break;
            case 3:
                modeStatement = `
let insideUV = step(abs(uv - vec2<f32>(0.5)), vec2<f32>(0.5));
sourceColor = textureSample(srcTexture, textureSampler, mix(input.texCoord, uv, insideUV));
`;
                break;
            default:
                modeStatement = `
sourceColor = textureSample(srcTexture, textureSampler, fract(uv));
`;
                break;
        }

        const uniformsStruct = needsSubstituteColor
            ? `struct DisplacementUniforms {
    uvToStScale: vec2<f32>,
    uvToStOffset: vec2<f32>,
    scale: vec2<f32>,
    padding: vec2<f32>,
    substituteColor: vec4<f32>,
}`
            : `struct DisplacementUniforms {
    uvToStScale: vec2<f32>,
    uvToStOffset: vec2<f32>,
    scale: vec2<f32>,
    padding: vec2<f32>,
}`;

        return /* wgsl */`
${WgslVertexOutput}

${uniformsStruct}

@group(0) @binding(0) var<uniform> uniforms: DisplacementUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var srcTexture: texture_2d<f32>;
@group(0) @binding(3) var mapTexture: texture_2d<f32>;

${WgslIsInside}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let stCoord = vec2<f32>(input.texCoord.x, 1.0 - input.texCoord.y);
    let st = stCoord * uniforms.uvToStScale - uniforms.uvToStOffset;
    let mapColor = textureSample(mapTexture, textureSampler, vec2<f32>(st.x, 1.0 - st.y));
    let offset = vec2<f32>(${cx}, ${cy}) - 0.5;
    let uv = input.texCoord + offset * uniforms.scale;
    var sourceColor: vec4<f32>;
    ${modeStatement}
    return mix(textureSample(srcTexture, textureSampler, input.texCoord), sourceColor, isInside(st));
}
`;
    }

    static getNodeClearVertexShader (): string
    {
        return NodeClearVertex;
    }

    static getNodeClearFragmentShader (): string
    {
        return NodeClearFragment;
    }

    static getPositionedTextureVertexShader (): string
    {
        return PositionedTextureVertex;
    }

    static getTextureScaleVertexShader (): string
    {
        return TextureScaleVertex;
    }

    static getTextureScaleBlendVertexShader (): string
    {
        return TextureScaleBlendVertex;
    }

    static getComplexBlendScaleVertexShader (): string
    {
        return ComplexBlendScaleVertex;
    }

    static getComplexBlendVertexShader (): string
    {
        return ComplexBlendVertex;
    }

    static getComplexBlendCopyVertexShader (): string
    {
        return ComplexBlendCopyVertex;
    }

    static getComplexBlendOutputVertexShader (): string
    {
        return ComplexBlendOutputVertex;
    }

    static getFilterComplexBlendOutputVertexShader (): string
    {
        return FilterComplexBlendOutputVertex;
    }

    static getPositionedTextureFragmentShader (): string
    {
        return PositionedTextureFragment;
    }
}
