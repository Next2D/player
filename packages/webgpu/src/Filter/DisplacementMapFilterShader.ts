/**
 * @description DisplacementMapFilter用WGSLシェーダーソース
 *              WGSL shader source for DisplacementMapFilter
 *
 *              ディスプレイスメントマップフィルターは、マップ画像の色値を使用して
 *              ソース画像のピクセルを移動させる
 */

/**
 * @description コンポーネントチャンネルからWGSL式を取得
 * @param {number} component - BitmapDataChannel値（1=R, 2=G, 4=B, 8=A）
 * @return {string}
 */
const getComponentExpression = (component: number): string => {
    switch (component) {
        case 1:  // BitmapDataChannel.RED
            return "mapColor.r";
        case 2:  // BitmapDataChannel.GREEN
            return "mapColor.g";
        case 4:  // BitmapDataChannel.BLUE
            return "mapColor.b";
        case 8:  // BitmapDataChannel.ALPHA
            return "mapColor.a";
        default:
            return "0.5";
    }
};

/**
 * @description モードに応じたサンプリング処理を取得
 * @param {number} mode
 * @return {string}
 */
const getModeStatement = (mode: number): string => {
    switch (mode) {
        case 0:
            // 直接サンプリング
            return `
    let sourceColor = textureSample(sourceTexture, sourceSampler, uv);`;

        case 1:
            // 代替色でクランプ
            return `
    let substituteColor = uniforms.substituteColor;
    let sourceColor = mix(substituteColor, textureSample(sourceTexture, sourceSampler, uv), isInside(uv));`;

        case 3:
            // 軸ごとのフォールバック付きクランプ
            return `
    let fallbackUv = mix(input.texCoord, uv, step(abs(uv - vec2<f32>(0.5)), vec2<f32>(0.5)));
    let sourceColor = textureSample(sourceTexture, sourceSampler, fallbackUv);`;

        case 2:
        default:
            // 小数UV折り返し（リピート）
            return `
    let sourceColor = textureSample(sourceTexture, sourceSampler, fract(uv));`;
    }
};

/**
 * @description DisplacementMapFilter用フラグメントシェーダーを生成
 * @param {number} componentX - X軸のコンポーネントチャンネル
 * @param {number} componentY - Y軸のコンポーネントチャンネル
 * @param {number} mode - ディスプレイスメントモード
 * @return {string}
 */
export const getDisplacementMapFilterFragmentShader = (
    componentX: number,
    componentY: number,
    mode: number
): string => {
    const cx = getComponentExpression(componentX);
    const cy = getComponentExpression(componentY);
    const modeStatement = getModeStatement(mode);

    // mode 1の場合は代替色が必要
    const hasSubstituteColor = mode === 1;

    return `
struct DisplacementMapUniforms {
    uvToStScale: vec2<f32>,
    uvToStOffset: vec2<f32>,
    scale: vec2<f32>,
    _pad: vec2<f32>,
${hasSubstituteColor ? "    substituteColor: vec4<f32>," : ""}
}

@group(0) @binding(0) var<uniform> uniforms: DisplacementMapUniforms;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(2) var sourceTexture: texture_2d<f32>;
@group(0) @binding(3) var mapTexture: texture_2d<f32>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

fn isInside(uv: vec2<f32>) -> f32 {
    let inside = step(vec2<f32>(0.0), uv) * step(uv, vec2<f32>(1.0));
    return inside.x * inside.y;
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

    let uvToStScale = uniforms.uvToStScale;
    let uvToStOffset = uniforms.uvToStOffset;
    let scale = uniforms.scale;

    // マップテクスチャの座標を計算
    let st = input.texCoord * uvToStScale - uvToStOffset;
    let mapColor = textureSample(mapTexture, sourceSampler, st);

    // オフセットを計算
    let offset = vec2<f32>(${cx}, ${cy}) - 0.5;
    let uv = input.texCoord + offset * scale;

    // モードに応じたサンプリング
    ${modeStatement}

    // マップ範囲内かどうかで最終色を決定
    let originalColor = textureSample(sourceTexture, sourceSampler, input.texCoord);
    return mix(originalColor, sourceColor, isInside(st));
}
`;
};

/**
 * @description DisplacementMapFilter用のシェーダーキーを生成
 * @param {number} componentX
 * @param {number} componentY
 * @param {number} mode
 * @return {string}
 */
export const getDisplacementMapFilterShaderKey = (
    componentX: number,
    componentY: number,
    mode: number
): string => {
    return `displacement_${componentX}_${componentY}_${mode}`;
};
