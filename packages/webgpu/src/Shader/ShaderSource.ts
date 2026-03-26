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

/**
 * @description WebGPU用シェーダーソース管理クラス
 *              WebGPU shader source management class providing all vertex and fragment shaders
 */
export class ShaderSource
{
    /**
     * @description 塗り用頂点シェーダーを取得する
     *              Get fill vertex shader
     *
     * @return {string}
     */
    static getFillVertexShader (): string
    {
        return FillVertex;
    }

    /**
     * @description 塗り用フラグメントシェーダーを取得する
     *              Get fill fragment shader
     *
     * @return {string}
     */
    static getFillFragmentShader (): string
    {
        return FillFragment;
    }

    /**
     * @description ステンシル書き込み用頂点シェーダーを取得する
     *              Get stencil write vertex shader
     *
     * @return {string}
     */
    static getStencilWriteVertexShader (): string
    {
        return StencilWriteVertex;
    }

    /**
     * @description ステンシル書き込み用フラグメントシェーダーを取得する
     *              Get stencil write fragment shader
     *
     * @return {string}
     */
    static getStencilWriteFragmentShader (): string
    {
        return StencilWriteFragment;
    }

    /**
     * @description ステンシル塗り用頂点シェーダーを取得する
     *              Get stencil fill vertex shader
     *
     * @return {string}
     */
    static getStencilFillVertexShader (): string
    {
        return StencilFillVertex;
    }

    /**
     * @description ステンシル塗り用フラグメントシェーダーを取得する
     *              Get stencil fill fragment shader
     *
     * @return {string}
     */
    static getStencilFillFragmentShader (): string
    {
        return StencilFillFragment;
    }

    /**
     * @description マスク用頂点シェーダーを取得する
     *              Get mask vertex shader
     *
     * @return {string}
     */
    static getMaskVertexShader (): string
    {
        return MaskVertex;
    }

    /**
     * @description マスク用フラグメントシェーダーを取得する
     *              Get mask fragment shader
     *
     * @return {string}
     */
    static getMaskFragmentShader (): string
    {
        return MaskFragment;
    }

    /**
     * @description 基本頂点シェーダーを取得する
     *              Get basic vertex shader
     *
     * @return {string}
     */
    static getBasicVertexShader (): string
    {
        return BasicVertex;
    }

    /**
     * @description 基本フラグメントシェーダーを取得する
     *              Get basic fragment shader
     *
     * @return {string}
     */
    static getBasicFragmentShader (): string
    {
        return BasicFragment;
    }

    /**
     * @description テクスチャフラグメントシェーダーを取得する
     *              Get texture fragment shader
     *
     * @return {string}
     */
    static getTextureFragmentShader (): string
    {
        return TextureFragment;
    }

    /**
     * @description インスタンス描画用頂点シェーダーを取得する
     *              Get instanced vertex shader
     *
     * @return {string}
     */
    static getInstancedVertexShader (): string
    {
        return InstancedVertex;
    }

    /**
     * @description インスタンス描画用フラグメントシェーダーを取得する
     *              Get instanced fragment shader
     *
     * @return {string}
     */
    static getInstancedFragmentShader (): string
    {
        return InstancedFragment;
    }

    /**
     * @description グラデーション塗り用頂点シェーダーを取得する
     *              Get gradient fill vertex shader
     *
     * @return {string}
     */
    static getGradientFillVertexShader (): string
    {
        return GradientFillVertex;
    }

    /**
     * @description グラデーション塗り用フラグメントシェーダーを取得する
     *              Get gradient fill fragment shader
     *
     * @return {string}
     */
    static getGradientFillFragmentShader (): string
    {
        return GradientFillFragment;
    }

    /**
     * @description ステンシル用グラデーション塗りフラグメントシェーダーを取得する
     *              Get gradient fill stencil fragment shader
     *
     * @return {string}
     */
    static getGradientFillStencilFragmentShader (): string
    {
        return GradientFillStencilFragment;
    }

    /**
     * @description グラデーションフラグメントシェーダーを取得する
     *              Get gradient fragment shader
     *
     * @return {string}
     */
    static getGradientFragmentShader (): string
    {
        return GradientFragment;
    }

    /**
     * @description ビットマップ塗り用頂点シェーダーを取得する
     *              Get bitmap fill vertex shader
     *
     * @return {string}
     */
    static getBitmapFillVertexShader (): string
    {
        return BitmapFillVertex;
    }

    /**
     * @description ビットマップ塗り用フラグメントシェーダーを取得する
     *              Get bitmap fill fragment shader
     *
     * @return {string}
     */
    static getBitmapFillFragmentShader (): string
    {
        return BitmapFillFragment;
    }

    /**
     * @description ブレンド用フラグメントシェーダーを取得する
     *              Get blend fragment shader
     *
     * @return {string}
     */
    static getBlendFragmentShader (): string
    {
        return BlendGenericFragment;
    }

    /**
     * @description ブラーフィルター用頂点シェーダーを取得する
     *              Get blur filter vertex shader
     *
     * @return {string}
     */
    static getBlurFilterVertexShader (): string
    {
        return BlurFilterVertex;
    }

    /**
     * @description ビットマップ同期用頂点シェーダーを取得する
     *              Get bitmap sync vertex shader
     *
     * @return {string}
     */
    static getBitmapSyncVertexShader (): string
    {
        return BitmapSyncVertex;
    }

    /**
     * @description ビットマップ同期用フラグメントシェーダーを取得する
     *              Get bitmap sync fragment shader
     *
     * @return {string}
     */
    static getBitmapSyncFragmentShader (): string
    {
        return BitmapSyncFragment;
    }

    /**
     * @description ブラーフィルター用フラグメントシェーダーを生成する
     *              Generate blur filter fragment shader
     *
     * @param  {number} half_blur - ブラーの半径値
     * @return {string}
     */
    static getBlurFilterFragmentShader (half_blur: number): string
    {
        const halfBlurFixed = half_blur.toFixed(1);

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

    /**
     * @description テクスチャコピー用フラグメントシェーダーを取得する
     *              Get texture copy fragment shader
     *
     * @return {string}
     */
    static getTextureCopyFragmentShader (): string
    {
        return TextureCopyFragment;
    }

    /**
     * @description ブラー用テクスチャコピーフラグメントシェーダーを取得する
     *              Get blur texture copy fragment shader
     *
     * @return {string}
     */
    static getBlurTextureCopyFragmentShader (): string
    {
        return BlurTextureCopyFragment;
    }

    /**
     * @description フィルター出力用フラグメントシェーダーを取得する
     *              Get filter output fragment shader
     *
     * @return {string}
     */
    static getFilterOutputFragmentShader (): string
    {
        return FilterOutputFragment;
    }

    /**
     * @description カラー変換フラグメントシェーダーを取得する
     *              Get color transform fragment shader
     *
     * @return {string}
     */
    static getColorTransformFragmentShader (): string
    {
        return ColorTransformFragment;
    }

    /**
     * @description Y軸反転付きカラー変換フラグメントシェーダーを取得する
     *              Get Y-flip color transform fragment shader
     *
     * @return {string}
     */
    static getYFlipColorTransformFragmentShader (): string
    {
        return YFlipColorTransformFragment;
    }

    /**
     * @description カラーマトリクスフィルターフラグメントシェーダーを取得する
     *              Get color matrix filter fragment shader
     *
     * @return {string}
     */
    static getColorMatrixFilterFragmentShader (): string
    {
        return ColorMatrixFilterFragment;
    }

    /**
     * @description グローフィルターフラグメントシェーダーを取得する
     *              Get glow filter fragment shader
     *
     * @return {string}
     */
    static getGlowFilterFragmentShader (): string
    {
        return GlowFilterFragment;
    }

    /**
     * @description ドロップシャドウフィルターフラグメントシェーダーを取得する
     *              Get drop shadow filter fragment shader
     *
     * @return {string}
     */
    static getDropShadowFilterFragmentShader (): string
    {
        return DropShadowFilterFragment;
    }

    /**
     * @description グラデーショングローフィルターフラグメントシェーダーを取得する
     *              Get gradient glow filter fragment shader
     *
     * @return {string}
     */
    static getGradientGlowFilterFragmentShader (): string
    {
        return GradientGlowFilterFragment;
    }

    /**
     * @description グラデーションベベルフィルターフラグメントシェーダーを取得する
     *              Get gradient bevel filter fragment shader
     *
     * @return {string}
     */
    static getGradientBevelFilterFragmentShader (): string
    {
        return GradientBevelFilterFragment;
    }

    /**
     * @description ベベルフィルターフラグメントシェーダーを取得する
     *              Get bevel filter fragment shader
     *
     * @return {string}
     */
    static getBevelFilterFragmentShader (): string
    {
        return BevelFilterFragment;
    }

    /**
     * @description ベベルフィルターベース処理フラグメントシェーダーを取得する
     *              Get bevel filter base fragment shader
     *
     * @return {string}
     */
    static getBevelBaseFragmentShader (): string
    {
        return BevelBaseFragment;
    }

    /**
     * @description コンボリューション（畳み込み）フィルターフラグメントシェーダーを生成する
     *              Generate convolution filter fragment shader
     *
     * @param  {number} matrix_x - コンボリューション行列のX次元サイズ
     * @param  {number} matrix_y - コンボリューション行列のY次元サイズ
     * @param  {boolean} [preserve_alpha=true] - 元のアルファ値を保持するかどうか
     * @param  {boolean} [clamp=true] - UV座標を範囲内にクランプするかどうか
     * @return {string}
     */
    static getConvolutionFilterFragmentShader (
        matrix_x: number,
        matrix_y: number,
        preserve_alpha: boolean = true,
        clamp: boolean = true
    ): string
    {
        const halfX = Math.floor(matrix_x * 0.5);
        const halfY = Math.floor(matrix_y * 0.5);
        const size = matrix_x * matrix_y;

        let matrixStatement = "";
        for (let idx = 0; idx < size; idx++) {
            matrixStatement += `
    result = result + getWeightedColor(${idx}, getMatrixWeight(${idx}));`;
        }

        const preserveAlphaStatement = preserve_alpha
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
    let iDivX = i / ${matrix_x};
    let iModX = i - ${matrix_x} * iDivX;
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
     * @description 複合ブレンドフラグメントシェーダーを取得する
     *              Get complex blend fragment shader
     *
     * @return {string}
     */
    static getComplexBlendFragmentShader (): string
    {
        return ShaderSource.getUnifiedComplexBlendFragmentShader();
    }

    /**
     * @description ブレンドモード名からインデックスを取得する
     *              Get blend mode index from blend mode name
     *
     * @param  {string} blend_mode - ブレンドモード名
     * @return {number}
     */
    static getBlendModeIndex (blend_mode: string): number
    {
        switch (blend_mode) {
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

    /**
     * @description 統合複合ブレンドフラグメントシェーダーを取得する
     *              Get unified complex blend fragment shader
     *
     * @return {string}
     */
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

    /**
     * @description ディスプレースメントマップフィルターフラグメントシェーダーを生成する
     *              Generate displacement map filter fragment shader
     *
     * @param  {number} component_x - X方向の色コンポーネント (1:R, 2:G, 4:B, 8:A)
     * @param  {number} component_y - Y方向の色コンポーネント (1:R, 2:G, 4:B, 8:A)
     * @param  {number} mode - マッピングモード (0:wrap, 1:color, 2:repeat, 3:clamp)
     * @return {string}
     */
    static getDisplacementMapFilterFragmentShader (
        component_x: number,
        component_y: number,
        mode: number
    ): string
    {
        let cx: string;
        let cy: string;

        switch (component_x) {
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

        switch (component_y) {
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

    /**
     * @description ノードクリア用頂点シェーダーを取得する
     *              Get node clear vertex shader
     *
     * @return {string}
     */
    static getNodeClearVertexShader (): string
    {
        return NodeClearVertex;
    }

    /**
     * @description ノードクリア用フラグメントシェーダーを取得する
     *              Get node clear fragment shader
     *
     * @return {string}
     */
    static getNodeClearFragmentShader (): string
    {
        return NodeClearFragment;
    }

    /**
     * @description 位置指定テクスチャ用頂点シェーダーを取得する
     *              Get positioned texture vertex shader
     *
     * @return {string}
     */
    static getPositionedTextureVertexShader (): string
    {
        return PositionedTextureVertex;
    }

    /**
     * @description テクスチャスケール用頂点シェーダーを取得する
     *              Get texture scale vertex shader
     *
     * @return {string}
     */
    static getTextureScaleVertexShader (): string
    {
        return TextureScaleVertex;
    }

    /**
     * @description テクスチャスケールブレンド用頂点シェーダーを取得する
     *              Get texture scale blend vertex shader
     *
     * @return {string}
     */
    static getTextureScaleBlendVertexShader (): string
    {
        return TextureScaleBlendVertex;
    }

    /**
     * @description 複合ブレンドスケール用頂点シェーダーを取得する
     *              Get complex blend scale vertex shader
     *
     * @return {string}
     */
    static getComplexBlendScaleVertexShader (): string
    {
        return ComplexBlendScaleVertex;
    }

    /**
     * @description 複合ブレンド用頂点シェーダーを取得する
     *              Get complex blend vertex shader
     *
     * @return {string}
     */
    static getComplexBlendVertexShader (): string
    {
        return ComplexBlendVertex;
    }

    /**
     * @description 複合ブレンドコピー用頂点シェーダーを取得する
     *              Get complex blend copy vertex shader
     *
     * @return {string}
     */
    static getComplexBlendCopyVertexShader (): string
    {
        return ComplexBlendCopyVertex;
    }

    /**
     * @description 複合ブレンド出力用頂点シェーダーを取得する
     *              Get complex blend output vertex shader
     *
     * @return {string}
     */
    static getComplexBlendOutputVertexShader (): string
    {
        return ComplexBlendOutputVertex;
    }

    /**
     * @description フィルター複合ブレンド出力用頂点シェーダーを取得する
     *              Get filter complex blend output vertex shader
     *
     * @return {string}
     */
    static getFilterComplexBlendOutputVertexShader (): string
    {
        return FilterComplexBlendOutputVertex;
    }

    /**
     * @description 位置指定テクスチャ用フラグメントシェーダーを取得する
     *              Get positioned texture fragment shader
     *
     * @return {string}
     */
    static getPositionedTextureFragmentShader (): string
    {
        return PositionedTextureFragment;
    }
}
