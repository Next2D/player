/**
 * @description BitmapFilter用WGSLシェーダーソース
 *              WGSL shader source for BitmapFilter
 *
 *              BitmapFilterは汎用的なフィルター合成シェーダーで、
 *              Glow、DropShadow、Bevel、GradientGlow、GradientBevelなどで使用される
 */

/**
 * @description BitmapFilter用フラグメントシェーダーを生成
 * @param {boolean} transformsBase - ベーステクスチャの座標変換が必要か
 * @param {boolean} transformsBlur - ブラーテクスチャの座標変換が必要か
 * @param {boolean} isGlow - グロー効果かどうか（false=ベベル）
 * @param {string} type - "full", "inner", "outer"
 * @param {boolean} knockout - ノックアウト効果
 * @param {boolean} appliesStrength - 強度適用するか
 * @param {boolean} isGradient - グラデーションカラーを使用するか
 * @return {string}
 */
export const getBitmapFilterFragmentShader = (
    transformsBase: boolean,
    transformsBlur: boolean,
    isGlow: boolean,
    type: string,
    knockout: boolean,
    appliesStrength: boolean,
    isGradient: boolean
): string => {
    const isInner = type === "inner";
    // isOuter and isFull used implicitly in switch statement

    // バインディングインデックスの計算
    let textureBindingIndex = 2; // 0=uniforms, 1=sampler, 2から開始
    const blurTextureBinding = textureBindingIndex++;
    const baseTextureBinding = transformsBase ? textureBindingIndex++ : -1;
    const gradientTextureBinding = isGradient ? textureBindingIndex++ : -1;

    // ユニフォームの構造体
    let uniformsStruct = `struct BitmapFilterUniforms {
`;
    if (transformsBase) {
        uniformsStruct += `    baseScale: vec2<f32>,
    baseOffset: vec2<f32>,
`;
    }
    if (transformsBlur) {
        uniformsStruct += `    blurScale: vec2<f32>,
    blurOffset: vec2<f32>,
`;
    }
    if (appliesStrength) {
        uniformsStruct += `    strength: f32,
    _padStrength: vec3<f32>,
`;
    }
    if (!isGradient) {
        if (isGlow) {
            uniformsStruct += `    color: vec4<f32>,
`;
        } else {
            uniformsStruct += `    highlightColor: vec4<f32>,
    shadowColor: vec4<f32>,
`;
        }
    }
    uniformsStruct += `}`;

    // テクスチャバインディング
    let textureBindings = `
@group(0) @binding(0) var<uniform> uniforms: BitmapFilterUniforms;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(${blurTextureBinding}) var blurTexture: texture_2d<f32>;`;

    if (transformsBase) {
        textureBindings += `
@group(0) @binding(${baseTextureBinding}) var baseTexture: texture_2d<f32>;`;
    }
    if (isGradient) {
        textureBindings += `
@group(0) @binding(${gradientTextureBinding}) var gradientTexture: texture_2d<f32>;`;
    }

    // ベーステクスチャの取得
    let baseStatement = "";
    if (transformsBase) {
        baseStatement = `
    let baseScale = uniforms.baseScale;
    let baseOffset = uniforms.baseOffset;
    let uv = input.texCoord * baseScale - baseOffset;
    let base = mix(vec4<f32>(0.0), textureSample(baseTexture, sourceSampler, uv), isInside(uv));`;
    }

    // ブラーテクスチャの取得
    let blurStatement = "";
    if (transformsBlur) {
        blurStatement = `
    let blurScale = uniforms.blurScale;
    let blurOffset = uniforms.blurOffset;
    let st = input.texCoord * blurScale - blurOffset;
    var blur = mix(vec4<f32>(0.0), textureSample(blurTexture, sourceSampler, st), isInside(st));`;
    } else {
        blurStatement = `
    var blur = textureSample(blurTexture, sourceSampler, input.texCoord);`;
    }

    // カラー処理
    let colorStatement = "";
    if (isGlow) {
        // グロー処理
        if (isInner) {
            colorStatement += `
    blur.a = 1.0 - blur.a;`;
        }
        if (appliesStrength) {
            colorStatement += `
    let strength = uniforms.strength;
    blur.a = clamp(blur.a * strength, 0.0, 1.0);`;
        }
        if (isGradient) {
            colorStatement += `
    blur = textureSample(gradientTexture, sourceSampler, vec2<f32>(blur.a, 0.5));`;
        } else {
            colorStatement += `
    let color = uniforms.color;
    blur = color * blur.a;`;
        }
    } else {
        // ベベル処理
        if (transformsBlur) {
            colorStatement += `
    let pq = (vec2<f32>(1.0) - input.texCoord) * blurScale - blurOffset;
    let blur2 = mix(vec4<f32>(0.0), textureSample(blurTexture, sourceSampler, pq), isInside(pq));`;
        } else {
            colorStatement += `
    let blur2 = textureSample(blurTexture, sourceSampler, vec2<f32>(1.0) - input.texCoord);`;
        }
        colorStatement += `
    var highlightAlpha = blur.a - blur2.a;
    var shadowAlpha = blur2.a - blur.a;`;

        if (appliesStrength) {
            colorStatement += `
    let strength = uniforms.strength;
    highlightAlpha = highlightAlpha * strength;
    shadowAlpha = shadowAlpha * strength;`;
        }

        colorStatement += `
    highlightAlpha = clamp(highlightAlpha, 0.0, 1.0);
    shadowAlpha = clamp(shadowAlpha, 0.0, 1.0);`;

        if (isGradient) {
            colorStatement += `
    blur = textureSample(gradientTexture, sourceSampler, vec2<f32>(
        0.5019607843137255 - 0.5019607843137255 * shadowAlpha + 0.4980392156862745 * highlightAlpha,
        0.5
    ));`;
        } else {
            colorStatement += `
    let highlightColor = uniforms.highlightColor;
    let shadowColor = uniforms.shadowColor;
    blur = highlightColor * highlightAlpha + shadowColor * shadowAlpha;`;
        }
    }

    // モード別の出力式
    let modeExpression = "";
    switch (type) {
        case "outer":
            modeExpression = knockout
                ? "blur - blur * base.a"
                : "base + blur - blur * base.a";
            break;
        case "full":
            modeExpression = knockout
                ? "blur"
                : "base - base * blur.a + blur";
            break;
        case "inner":
        default:
            modeExpression = "blur";
            break;
    }

    // base変数が必要かどうか
    const needsBase = transformsBase || (type === "outer" || (type === "full" && !knockout));
    let baseDecl = "";
    if (needsBase && !transformsBase) {
        baseDecl = `
    let base = vec4<f32>(0.0);`;
    }

    return `
${uniformsStruct}
${textureBindings}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

fn isInside(uv: vec2<f32>) -> f32 {
    let inside = step(vec2<f32>(0.0), uv) * step(uv, vec2<f32>(1.0));
    return inside.x * inside.y;
}

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
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    ${baseDecl}
    ${baseStatement}
    ${blurStatement}
    ${colorStatement}

    return ${modeExpression};
}
`;
};

/**
 * @description BitmapFilter用のシェーダーキーを生成
 * @param {boolean} transformsBase
 * @param {boolean} transformsBlur
 * @param {boolean} isGlow
 * @param {string} type
 * @param {boolean} knockout
 * @param {boolean} appliesStrength
 * @param {boolean} isGradient
 * @return {string}
 */
export const getBitmapFilterShaderKey = (
    transformsBase: boolean,
    transformsBlur: boolean,
    isGlow: boolean,
    type: string,
    knockout: boolean,
    appliesStrength: boolean,
    isGradient: boolean
): string => {
    const key1 = transformsBase ? "y" : "n";
    const key2 = transformsBlur ? "y" : "n";
    const key3 = isGlow ? "g" : "b";
    const key4 = knockout ? "k" : "n";
    const key5 = appliesStrength ? "s" : "n";
    const key6 = isGradient ? "gr" : "so";
    return `bitmap_${key1}${key2}${key3}${type}${key4}${key5}${key6}`;
};
