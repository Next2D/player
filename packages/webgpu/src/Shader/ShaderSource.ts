import { FillVertex, FillMainVertex } from "./wgsl/vertex/FillVertex";
import { StencilWriteVertex, StencilWriteMainVertex, StencilFillVertex } from "./wgsl/vertex/StencilVertex";
import { MaskVertex } from "./wgsl/vertex/MaskVertex";
import { BasicVertex, BasicMainVertex } from "./wgsl/vertex/BasicVertex";
import { InstancedVertex } from "./wgsl/vertex/InstancedVertex";
import { GradientFillVertex, GradientFillMainVertex } from "./wgsl/vertex/GradientVertex";
import { BitmapFillVertex, BitmapFillMainVertex } from "./wgsl/vertex/BitmapVertex";
import { BlurFilterVertex, NodeClearVertex, PositionedTextureVertex } from "./wgsl/vertex/FilterVertex";

import { FillFragment } from "./wgsl/fragment/FillFragment";
import { StencilWriteFragment, StencilFillFragment } from "./wgsl/fragment/StencilFragment";
import { MaskFragment } from "./wgsl/fragment/MaskFragment";
import { BasicFragment, TextureFragment } from "./wgsl/fragment/BasicFragment";
import { InstancedFragment } from "./wgsl/fragment/InstancedFragment";
import { GradientFillFragment, GradientFragment } from "./wgsl/fragment/GradientFragment";
import { BitmapFillFragment } from "./wgsl/fragment/BitmapFragment";
import {
    TextureCopyFragment,
    BlurTextureCopyFragment,
    FilterOutputFragment,
    ColorMatrixFilterFragment,
    NodeClearFragment,
    PositionedTextureFragment,
    BlendGenericFragment
} from "./wgsl/fragment/FilterFragment";
import {
    GlowFilterFragment,
    DropShadowFilterFragment,
    GradientGlowFilterFragment,
    GradientBevelFilterFragment,
    BevelFilterFragment
} from "./wgsl/fragment/EffectFragment";

/**
 * @description WebGPU用の基本的なシェーダーソース
 *              Basic shader sources for WebGPU
 */
export class ShaderSource
{
    /**
     * @description 単色塗りつぶし用頂点シェーダー（17 floats頂点フォーマット）
     * @return {string}
     */
    static getFillVertexShader (): string
    {
        return FillVertex;
    }

    /**
     * @description 単色塗りつぶし用頂点シェーダー（メインアタッチメント用）
     * @return {string}
     */
    static getFillMainVertexShader (): string
    {
        return FillMainVertex;
    }

    /**
     * @description 単色塗りつぶし用フラグメントシェーダー（1パスLoop-Blinn）
     * @return {string}
     */
    static getFillFragmentShader (): string
    {
        return FillFragment;
    }

    /**
     * @description ステンシル書き込み用頂点シェーダー（アトラス用）
     * @return {string}
     */
    static getStencilWriteVertexShader (): string
    {
        return StencilWriteVertex;
    }

    /**
     * @description ステンシル書き込み用頂点シェーダー（メインアタッチメント用）
     * @return {string}
     */
    static getStencilWriteMainVertexShader (): string
    {
        return StencilWriteMainVertex;
    }

    /**
     * @description ステンシル書き込み用フラグメントシェーダー（Pass1）
     * @return {string}
     */
    static getStencilWriteFragmentShader (): string
    {
        return StencilWriteFragment;
    }

    /**
     * @description ステンシルフィル用頂点シェーダー（Pass2）
     * @return {string}
     */
    static getStencilFillVertexShader (): string
    {
        return StencilFillVertex;
    }

    /**
     * @description ステンシルフィル用フラグメントシェーダー（Pass2）
     * @return {string}
     */
    static getStencilFillFragmentShader (): string
    {
        return StencilFillFragment;
    }

    /**
     * @description マスク用頂点シェーダー（ベジェ曲線）
     * @return {string}
     */
    static getMaskVertexShader (): string
    {
        return MaskVertex;
    }

    /**
     * @description マスク用フラグメントシェーダー（ベジェ曲線アンチエイリアシング）
     * @return {string}
     */
    static getMaskFragmentShader (): string
    {
        return MaskFragment;
    }

    /**
     * @description 基本的な頂点シェーダー（ストローク用、アトラスターゲット）
     * @return {string}
     */
    static getBasicVertexShader (): string
    {
        return BasicVertex;
    }

    /**
     * @description 基本的な頂点シェーダー（ストローク用、メインアタッチメント）
     * @return {string}
     */
    static getBasicMainVertexShader (): string
    {
        return BasicMainVertex;
    }

    /**
     * @description 基本的なフラグメントシェーダー（単色塗りつぶし）
     * @return {string}
     */
    static getBasicFragmentShader (): string
    {
        return BasicFragment;
    }

    /**
     * @description テクスチャ用フラグメントシェーダー
     * @return {string}
     */
    static getTextureFragmentShader (): string
    {
        return TextureFragment;
    }

    /**
     * @description インスタンス描画用頂点シェーダー
     * @return {string}
     */
    static getInstancedVertexShader (): string
    {
        return InstancedVertex;
    }

    /**
     * @description インスタンス描画用フラグメントシェーダー（アトラステクスチャから描画）
     * @return {string}
     */
    static getInstancedFragmentShader (): string
    {
        return InstancedFragment;
    }

    /**
     * @description グラデーションフィル用頂点シェーダー（行列変換でUV座標を計算）
     * @return {string}
     */
    static getGradientFillVertexShader (): string
    {
        return GradientFillVertex;
    }

    /**
     * @description グラデーションフィル用頂点シェーダー（メインアタッチメント用）
     * @return {string}
     */
    static getGradientFillMainVertexShader (): string
    {
        return GradientFillMainVertex;
    }

    /**
     * @description グラデーションフィル用フラグメントシェーダー
     * @return {string}
     */
    static getGradientFillFragmentShader (): string
    {
        return GradientFillFragment;
    }

    /**
     * @description グラデーション用フラグメントシェーダー（レガシー）
     * @return {string}
     */
    static getGradientFragmentShader (): string
    {
        return GradientFragment;
    }

    /**
     * @description ビットマップフィル用頂点シェーダー（行列変換でUV座標を計算）
     * @return {string}
     */
    static getBitmapFillVertexShader (): string
    {
        return BitmapFillVertex;
    }

    /**
     * @description ビットマップフィル用頂点シェーダー（メインアタッチメント用）
     * @return {string}
     */
    static getBitmapFillMainVertexShader (): string
    {
        return BitmapFillMainVertex;
    }

    /**
     * @description ビットマップフィル用フラグメントシェーダー
     * @return {string}
     */
    static getBitmapFillFragmentShader (): string
    {
        return BitmapFillFragment;
    }

    /**
     * @description ブレンドモード用フラグメントシェーダー
     * @return {string}
     */
    static getBlendFragmentShader (): string
    {
        return BlendGenericFragment;
    }

    /**
     * @description ブラーフィルター用頂点シェーダー
     * @return {string}
     */
    static getBlurFilterVertexShader (): string
    {
        return BlurFilterVertex;
    }

    /**
     * @description ブラーフィルター用フラグメントシェーダー
     * @param {number} halfBlur - 半分のブラー値（サンプル数の決定に使用）
     * @return {string}
     */
    static getBlurFilterFragmentShader (halfBlur: number): string
    {
        const halfBlurFixed = halfBlur.toFixed(1);

        return /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

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

    /**
     * @description テクスチャコピー用フラグメントシェーダー
     * @return {string}
     */
    static getTextureCopyFragmentShader (): string
    {
        return TextureCopyFragment;
    }

    /**
     * @description ブラーフィルター用テクスチャコピーシェーダー
     * @return {string}
     */
    static getBlurTextureCopyFragmentShader (): string
    {
        return BlurTextureCopyFragment;
    }

    /**
     * @description フィルター出力用フラグメントシェーダー
     * @return {string}
     */
    static getFilterOutputFragmentShader (): string
    {
        return FilterOutputFragment;
    }

    /**
     * @description ColorMatrixフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getColorMatrixFilterFragmentShader (): string
    {
        return ColorMatrixFilterFragment;
    }

    /**
     * @description Glowフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getGlowFilterFragmentShader (): string
    {
        return GlowFilterFragment;
    }

    /**
     * @description DropShadowフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getDropShadowFilterFragmentShader (): string
    {
        return DropShadowFilterFragment;
    }

    /**
     * @description GradientGlowフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getGradientGlowFilterFragmentShader (): string
    {
        return GradientGlowFilterFragment;
    }

    /**
     * @description GradientBevelフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getGradientBevelFilterFragmentShader (): string
    {
        return GradientBevelFilterFragment;
    }

    /**
     * @description Bevelフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getBevelFilterFragmentShader (): string
    {
        return BevelFilterFragment;
    }

    /**
     * @description ConvolutionFilter用フラグメントシェーダー
     * @param {number} matrixX - カーネル行列の幅
     * @param {number} matrixY - カーネル行列の高さ
     * @param {boolean} preserveAlpha - アルファを保持するかどうか
     * @param {boolean} clamp - 境界をクランプするかどうか
     * @return {string}
     */
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

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

fn isInside(uv: vec2<f32>) -> f32 {
    let inside = step(vec2<f32>(0.0), uv) * step(uv, vec2<f32>(1.0));
    return inside.x * inside.y;
}

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

    /**
     * @description 複雑なブレンドモード用フラグメントシェーダーを取得
     * @param {string} blendMode - ブレンドモード名
     * @return {string}
     */
    static getComplexBlendFragmentShader (blendMode: string): string
    {
        let blendFunction: string;

        switch (blendMode) {
            case "subtract":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;
    var c = vec4<f32>(dstRgb - srcRgb, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
                break;

            case "multiply":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let c = src * dst;
    return a + b + c;
}
`;
                break;

            case "lighten":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;
    let mixed = mix(srcRgb, dstRgb, step(srcRgb, dstRgb));
    var c = vec4<f32>(mixed, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
                break;

            case "darken":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;
    let mixed = mix(srcRgb, dstRgb, step(dstRgb, srcRgb));
    var c = vec4<f32>(mixed, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
                break;

            case "overlay":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;
    let mul = srcRgb * dstRgb;
    let c1 = 2.0 * mul;
    let c2 = 2.0 * (srcRgb + dstRgb - mul) - 1.0;
    let mixed = mix(c1, c2, step(vec3<f32>(0.5), dstRgb));
    var c = vec4<f32>(mixed, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
                break;

            case "hardlight":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;
    let mul = srcRgb * dstRgb;
    let c1 = 2.0 * mul;
    let c2 = 2.0 * (srcRgb + dstRgb - mul) - 1.0;
    let mixed = mix(c1, c2, step(vec3<f32>(0.5), srcRgb));
    var c = vec4<f32>(mixed, src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
                break;

            case "difference":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let a = src - src * dst.a;
    let b = dst - dst * src.a;
    let srcRgb = src.rgb / src.a;
    let dstRgb = dst.rgb / dst.a;
    var c = vec4<f32>(abs(srcRgb - dstRgb), src.a * dst.a);
    c = vec4<f32>(c.rgb * c.a, c.a);
    return a + b + c;
}
`;
                break;

            case "invert":
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }
    let b = dst - dst * src.a;
    let c = vec4<f32>(src.a - dst.rgb * src.a, src.a);
    return b + c;
}
`;
                break;

            default:
                blendFunction = `
fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
    return src + dst - dst * src.a;
}
`;
                break;
        }

        return /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

struct BlendUniforms {
    mulColor: vec4<f32>,
    addColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var dstTexture: texture_2d<f32>;
@group(0) @binding(3) var srcTexture: texture_2d<f32>;

${blendFunction}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var dst = textureSample(dstTexture, textureSampler, input.texCoord);
    var src = textureSample(srcTexture, textureSampler, input.texCoord);
    src = src * uniforms.mulColor + uniforms.addColor;
    src = clamp(src, vec4<f32>(0.0), vec4<f32>(1.0));
    src = vec4<f32>(src.rgb * src.a, src.a);
    return blend(src, dst);
}
`;
    }

    /**
     * @description DisplacementMapFilterフラグメントシェーダー
     * @param {number} componentX - X方向のチャンネル
     * @param {number} componentY - Y方向のチャンネル
     * @param {number} mode - モード
     * @return {string}
     */
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
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

${uniformsStruct}

@group(0) @binding(0) var<uniform> uniforms: DisplacementUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var srcTexture: texture_2d<f32>;
@group(0) @binding(3) var mapTexture: texture_2d<f32>;

fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec2<f32>(0.0), uv) - step(vec2<f32>(1.0), uv);
    return s.x * s.y;
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let st = input.texCoord * uniforms.uvToStScale - uniforms.uvToStOffset;
    let mapColor = textureSample(mapTexture, textureSampler, st);
    let offset = vec2<f32>(${cx}, ${cy}) - 0.5;
    let uv = input.texCoord + offset * uniforms.scale;
    var sourceColor: vec4<f32>;
    ${modeStatement}
    return mix(textureSample(srcTexture, textureSampler, input.texCoord), sourceColor, isInside(st));
}
`;
    }

    /**
     * @description ノードクリア用頂点シェーダー
     * @return {string}
     */
    static getNodeClearVertexShader (): string
    {
        return NodeClearVertex;
    }

    /**
     * @description ノードクリア用フラグメントシェーダー
     * @return {string}
     */
    static getNodeClearFragmentShader (): string
    {
        return NodeClearFragment;
    }

    /**
     * @description 位置変換付きテクスチャ描画用頂点シェーダー
     * @return {string}
     */
    static getPositionedTextureVertexShader (): string
    {
        return PositionedTextureVertex;
    }

    /**
     * @description 位置変換付きテクスチャ描画用フラグメントシェーダー
     * @return {string}
     */
    static getPositionedTextureFragmentShader (): string
    {
        return PositionedTextureFragment;
    }
}
