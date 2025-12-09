/**
 * @description ConvolutionFilter用WGSLシェーダーソース
 *              WGSL shader source for ConvolutionFilter
 *
 *              畳み込みフィルターは、カーネル行列を使用して画像処理を行う
 *              シャープ化、エッジ検出、エンボスなどの効果を実現
 */

/**
 * @description ConvolutionFilter用フラグメントシェーダーを生成
 *              Generate fragment shader for ConvolutionFilter
 * @param {number} matrixX - カーネル行列の幅
 * @param {number} matrixY - カーネル行列の高さ
 * @param {boolean} preserveAlpha - アルファを保持するかどうか
 * @param {boolean} clamp - 境界をクランプするかどうか
 * @return {string}
 */
export const getConvolutionFilterFragmentShader = (
    matrixX: number,
    matrixY: number,
    preserveAlpha: boolean,
    clamp: boolean
): string => {
    const halfX = Math.floor(matrixX * 0.5);
    const halfY = Math.floor(matrixY * 0.5);
    const size = matrixX * matrixY;

    // マトリックス要素を取得するコードを生成
    let matrixStatement = "";
    for (let idx = 0; idx < size; idx++) {
        matrixStatement += `
    result = result + getWeightedColor(${idx}, getMatrixWeight(${idx}));`;
    }

    // アルファ保持のステートメント
    const preserveAlphaStatement = preserveAlpha
        ? "result.a = textureSample(sourceTexture, sourceSampler, input.texCoord).a;"
        : "";

    // クランプ外の処理
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
    // Unpremultiply
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

    // Premultiply
    result = vec4<f32>(result.rgb * result.a, result.a);
    return result;
}
`;
};

/**
 * @description ConvolutionFilter用のシェーダーキーを生成
 * @param {number} matrixX
 * @param {number} matrixY
 * @param {boolean} preserveAlpha
 * @param {boolean} clamp
 * @return {string}
 */
export const getConvolutionFilterShaderKey = (
    matrixX: number,
    matrixY: number,
    preserveAlpha: boolean,
    clamp: boolean
): string => {
    return `convolution_${matrixX}x${matrixY}_${preserveAlpha ? "pa" : "npa"}_${clamp ? "c" : "nc"}`;
};
